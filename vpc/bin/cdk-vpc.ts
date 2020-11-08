#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkVpcStack } from '../lib/cdk-vpc-stack';
import { env } from 'process';

const app = new cdk.App();
new CdkVpcStack(app, 'CdkVpcStack',{
    env: {
        region: 'ap-northeast-1',
        account: env.AWS_ACCOUNT,
    }});
