import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as ssm from '@aws-cdk/aws-ssm';

export class CdkRdsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpcId=ssm.StringParameter.valueFromLookup(this,'/base/vpcId');

    // 作成したVPCを取得
    const targetVpc = ec2.Vpc.fromLookup(this, 'base-vpc', {
      vpcId: vpcId,
    });

    const subneta=targetVpc.privateSubnets[0]
    const subnetb=targetVpc.privateSubnets[1]
    const selectSubnets: ec2.SelectedSubnets = targetVpc.selectSubnets({
      subnets: targetVpc.privateSubnets});

    // セキュリティーグループを作成
    const securityGroup: ec2.ISecurityGroup = new ec2.SecurityGroup(
      this, 'SecurityGroup', {vpc:targetVpc,
        allowAllOutbound: false,
      },
    );
    securityGroup.addEgressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(3306),
      'for Rds'
    )

    securityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3306),
      'for Rds'
    )

    // Data API用
    securityGroup.addEgressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(80),
      'for Rds'
    )
    securityGroup.addEgressRule(
      ec2.Peer.anyIpv6(),
      ec2.Port.tcp(80),
      'for Rds'
    )

    securityGroup.addIngressRule(
      securityGroup,
      ec2.Port.tcp(3306),
      'for Rds'
    )

    const subnetGroup=new rds.SubnetGroup(this,'subnetgroup',{
      vpc:targetVpc,
      description:'for rds subnetGroup',
      subnetGroupName:'rds-subnet-group',
      vpcSubnets:selectSubnets
    })


    
    const masterUsername=ssm.StringParameter.valueFromLookup(this,'/rdsAurora/masterUserName');
    const masterPassword=ssm.StringParameter.valueFromLookup(this,'/rdsAurora/masterPassword');

    const rdsCluster = new rds.CfnDBCluster(this, 'DBCluster', { 
      engine: 'aurora-mysql',
      dbClusterIdentifier: `main-cluster`,
      engineMode: 'serverless',
      engineVersion: '5.7.mysql_aurora.2.07.1',
      enableHttpEndpoint: true,
      databaseName: 'rdsaurora',
      masterUsername: masterUsername,
      masterUserPassword: masterPassword,
      backupRetentionPeriod:  1 ,
      dbSubnetGroupName:subnetGroup.subnetGroupName,
      scalingConfiguration: {
        autoPause: true,
        maxCapacity:  4 ,
        minCapacity: 2,
        secondsUntilAutoPause:  300 ,
      },
      deletionProtection:  false ,
      vpcSecurityGroupIds:[securityGroup.securityGroupId],
      // バックアップ実施時間UTCで指定
      preferredBackupWindow:'18:00-18:30' ,
    });

    // エンドポイントを設定
    new ssm.StringParameter(this,'rds-host',{
      parameterName:'/rdsAurora/hostname',
      stringValue:rdsCluster.attrEndpointAddress
    })



  }
}
