import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

import { Module } from '@nestjs/common';

export const DYNAMODB_TOKEN = 'DYNAMODB_CLIENT';

// When deploying your application within the AWS ecosystem,
// it's a security best practice to assign an IAM Role to your EC2 instance with the minimum necessary permissions.
// By doing this, you ensure that your application can securely access AWS services like DynamoDB without needing to store AWS credentials within your source code.
// Instead, the AWS SDK used within your EC2 instance will automatically retrieve the necessary credentials from the EC2 environment.

// In essence, the IAM Role associated with your EC2 instance simplifies and enhances the security of AWS service access
// by eliminating the need for explicit credential management within your application code.

// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-iam.html

@Module({
  providers: [
    {
      provide: DYNAMODB_TOKEN,
      useValue: new DynamoDBClient({
        region: 'your-region',
        // credentials: do not define, SDK automatically will grad creds from IAM role assigned to EC2 instance
      }),
    },
  ],
  exports: [DYNAMODB_TOKEN],
})
export class DynamoDBModule {}
