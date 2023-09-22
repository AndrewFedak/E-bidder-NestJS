import { Module } from '@nestjs/common';

import { BidOnAuctionModule } from './bid-on-auction/bid-on-auction.module';
import { CreateAuctionModule } from './create-auction/create-auction.module';
import { QueryAuctionStatusModule } from './query-auction-status/query-auction-status.module';
import { QueryBidHistoryModule } from './query-bid-history/query-bid-history.module';

import { AuctionController } from './auctions.controller';

@Module({
  controllers: [AuctionController],
  imports: [
    CreateAuctionModule,
    BidOnAuctionModule,
    QueryBidHistoryModule,
    QueryAuctionStatusModule,
  ],
})
export class AuctionModule {}
