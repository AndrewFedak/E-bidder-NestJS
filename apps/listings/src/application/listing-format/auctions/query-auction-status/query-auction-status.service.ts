import { Inject } from '@nestjs/common';

import { IClock } from '@app/listings/src/infrastructure/clock';
import { DYNAMODB_TOKEN } from '@app/listings/src/infrastructure/dynamodb/dynamodb.module';

import { IBidHistoryRepository } from '@app/listings/src/domain/listing-format/auctions/models/bids/bid-history.repository';

import { AuctionStatus } from './auction-status';

export class QueryAuctionStatus {
  constructor(
    @Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: any,
    private readonly _bidHistory: IBidHistoryRepository,
    private readonly _clock: IClock,
  ) {}

  auctionStatus(auctionId: string): AuctionStatus {
    const status = (this._dynamoDB as object)
      .CreateSQLQuery(
        `select Id, CurrentPrice, BidderMemberId as WinningBidderId, AuctionEnds from Auctions Where Id = '${auctionId}'`,
      )
      .SetResultTransformer(Transformers.AliasToBean<AuctionStatus>())
      .UniqueResult<AuctionStatus>();

    status.TimeRemaining = this.timeRemaining(status.AuctionEnds);
    status.NumberOfBids = this._bidHistory.noOfBidsFor(auctionId);

    return status;
  }

  private timeRemaining(auctionEnds: Date) {
    if (this._clock.time() < auctionEnds)
      return auctionEnds.Subtract(this._clock.time());
    else return new TimeSpan();
  }
}
