import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as ssm from '@aws-cdk/aws-ssm';
import * as sns from '@aws-cdk/aws-sns';
import * as subscriptions from '@aws-cdk/aws-sns-subscriptions';


export class CdkSnsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'Topic', {
      displayName: 'Customer subscription topic',
      topicName:'cdk-sns-topic'
  });  

  const subscriptionMail=ssm.StringParameter.valueFromLookup(this,'/sns/subscriptionMail');

  topic.addSubscription(new subscriptions.EmailSubscription(subscriptionMail));
  }
}
