import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';
import * as s3 from '@aws-cdk/aws-s3';

export class CdkS3Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3
    const sdfDataBucket = new s3.Bucket(this, 's3-bucket-data-1', {
      bucketName: `s3-bucket-data-1-${this.region}-${this.account}`,
      blockPublicAccess:s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules:[
        {
          expiration:cdk.Duration.days(30),
          prefix:'data',
          id:'delete for data'
        }

      ]
    });

  }
}
