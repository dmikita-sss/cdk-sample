import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';

export class CdkVpcStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'base-vpc', {
      cidr: '10.1.0.0/16',
      natGateways: 1,
      subnetConfiguration: [
          {
              cidrMask: 24,
              name: 'private',
              subnetType: ec2.SubnetType.PRIVATE,
          },
          {
              cidrMask: 24,
              name: 'public',
              subnetType: ec2.SubnetType.PUBLIC,
          },
      ],
      enableDnsSupport: true,
      enableDnsHostnames: true,
      
    });
    new ssm.StringParameter(this, 'base-vpc-VpcId', {
        parameterName: '/base/vpcId',
        stringValue: vpc.vpcId,
    });

    const endpointS3Pri = vpc.addGatewayEndpoint('endpoint-S3-pri', {
        service: ec2.GatewayVpcEndpointAwsService.S3,
        subnets: [{ subnetType: ec2.SubnetType.PRIVATE }]
    });
    const endpointS3Pub = vpc.addGatewayEndpoint('endpoint-S3-Pub', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
      subnets: [{ subnetType: ec2.SubnetType.PUBLIC }]
  });




  }
}
