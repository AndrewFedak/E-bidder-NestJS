import { Module } from '@nestjs/common';

import { DynamoDBModule } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { AuctionRepository } from '@app/listings/src/infrastructure/auction.repository.impl';
import { BidHistoryRepository } from '@app/listings/src/infrastructure/bid-history.repository.impl';

import { MemberService } from '@app/listings/src/domain/members/member.service';

import { BidOnAuctionService } from './bid-on-auction.service';

// Decided to define here DB module instead of Repository implementation as @Module
// to explicitly define for Service layer which persistence technologies been used
// so that Service would impllement, lets say, transactions for particular persistence framework

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
