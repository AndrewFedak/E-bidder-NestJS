import { Module } from '@nestjs/common';

import { DynamoDBModule } from '@app/listings/src/infrastructure/dynamodb/dynamodb.module';

import { AuctionRepository } from '@app/listings/src/infrastructure/auction.repository.impl';
import { BidHistoryRepository } from '@app/listings/src/infrastructure/bid-history.repository.impl';

import { MemberService } from '@app/listings/src/domain/members/member.service';

import { BidOnAuctionService } from './bid-on-auction.service';

@Module({
  imports: [DynamoDBModule],
  providers: [
    BidOnAuctionService,
    AuctionRepository,
    BidHistoryRepository,
    MemberService,
  ],
  exports: [BidOnAuctionService],
})
export class BidOnAuctionModule {}
