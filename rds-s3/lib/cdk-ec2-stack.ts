import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as ssm from '@aws-cdk/aws-ssm';

export class CdkEc2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpcId=ssm.StringParameter.valueFromLookup(this,'/base/vpcId');

    // 作成したVPCを取得
    const targetVpc = ec2.Vpc.fromLookup(this, 'base-vpc', {
      vpcId: vpcId,
    });


    // セキュリティーグループを作成
    const securityGroup: ec2.ISecurityGroup = new ec2.SecurityGroup(
      this, 'SecurityGroup', {vpc:targetVpc,
        allowAllOutbound: true,
        securityGroupName:'advent-calendar-sg'
      },
    );
    securityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(8083),
  
        'for Advent Calendar'
      )
    securityGroup.addIngressRule(
    ec2.Peer.anyIpv6(),
    ec2.Port.tcp(8083),

      'for Advent Calendar'
    )

  let ec2Instance = new ec2.CfnInstance(this, 'ec2-AdventCalendar', {
    imageId:  'ami-00f58a07aaa3179b8',
    // 新規でインスタンスを作成する場合は以下を使用
    //imageId : new ec2.AmazonLinuxImage().getImage(this).imageId,
    instanceType: new ec2.InstanceType('t3.micro').toString(),
    networkInterfaces: [{
      associatePublicIpAddress: true,
      deviceIndex: '0',
      groupSet: [securityGroup.securityGroupId],
      subnetId: targetVpc.publicSubnets[0].subnetId
    }],
    keyName: this.node.tryGetContext('key_pair'),

  });
  

  }
}
