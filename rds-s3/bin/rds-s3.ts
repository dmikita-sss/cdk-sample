#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RdsS3Stack } from '../lib/rds-s3-stack';
import { CdkRdsStack } from '../lib/cdk-rds-stack';
import { CdkS3Stack } from '../lib/cdk-s3-stack';
import { CdkEc2Stack } from '../lib/cdk-ec2-stack';
import { CdkSnsStack } from '../lib/cdk-sns-stack';


import { env } from 'process';

const app = new cdk.App();

new RdsS3Stack(app,'RdsS3Stack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
}});
new CdkRdsStack(app,'CdkRdsStack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
}});
new CdkS3Stack(app,'CdkS3Stack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
}});

new CdkEc2Stack(app,'CdkEc2Stack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
}});

new CdkSnsStack(app,'CdkSnsStack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
}});
