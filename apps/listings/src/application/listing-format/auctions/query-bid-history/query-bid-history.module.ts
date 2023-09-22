import { Module } from '@nestjs/common';

import { DynamoDBModule } from '@app/listings/src/infrastructure/dynamodb/dynamodb.module';

import { QueryBidHistory } from './query-bid-history,service';

@Module({
  imports: [DynamoDBModule],
  providers: [QueryBidHistory],
})
export class QueryBidHistoryModule {}
