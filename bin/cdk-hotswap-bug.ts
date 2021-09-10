#!/usr/bin/env node
import 'source-map-support/register';
import * as path from 'path';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';

export class BugStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps = {}) {
    super(scope, id, props);

    new lambda.Function(this, 'Function', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset(path.join(__dirname, 'function')),
      handler: 'bug-handler.handler',
      environment: {
        // This should change every time we synth, causing a non-asset change
        ENV_VARS_LAST_UPDATE: new Date().toISOString(),
        
        // By adding this environment variable, somehow the dynamic env var
        // above is ignored as a non-asset change.
        ENV_CONFUSE_IT: 'some constant value',
      },
    });
  }
}

const app = new cdk.App();
new BugStack(app, 'BugStack');
