import { Module } from '@nestjs/common';

import { DynamoDBModule } from '@app/listings/src/infrastructure/dynamodb/dynamodb.module';

import { QueryAuctionStatus } from './query-auction-status.service';

@Module({
  imports: [DynamoDBModule],
  providers: [QueryAuctionStatus],
  exports: [QueryAuctionStatus],
})
export class QueryAuctionStatusModule {}
