import { DynamoDB } from 'aws-sdk';

import { Module } from '@nestjs/common';

export const DYNAMODB_TOKEN = 'DYNAMODB_CLIENT';

@Module({
  providers: [
    {
      provide: DYNAMODB_TOKEN,
      useValue: new DynamoDB.DocumentClient({
        region: 'your-region',
      }),
    },
  ],
  exports: [DYNAMODB_TOKEN],
})
export class DynamoDBModule {}
