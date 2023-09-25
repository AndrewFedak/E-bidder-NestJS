import { Inject } from '@nestjs/common';

import { Clock } from '@app/listings/src/infrastructure/clock';
import { DYNAMODB_TOKEN } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { IBidHistoryRepository } from '@app/listings/src/domain/listing-format/auctions/models/bids/bid-history.repository';

import { AuctionStatus } from './auction-status';

// Instead of returning the domain object, you will use a simple view model (AuctionStatus).

/* The auction status query requires native SQL to be used because you have no public getters to
transform the aggregate into an AuctionStatus DTO. 

However, this cleanly separates the domain model from the application’s reporting needs 
and prevents the repository from having to deal with reporting concerns. */

export class QueryAuctionStatus {
  constructor(
    @Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: any,
    private readonly _bidHistory: IBidHistoryRepository,
    private readonly _clock: Clock,
  ) {}

  auctionStatus(auctionId: string): AuctionStatus {
    const status = (this._dynamoDB as object)
      .CreateSQLQuery(
        `select Id, CurrentPrice, BidderMemberId as WinningBidderId, AuctionEnds from Auctions Where Id = '${auctionId}'`,
      )
      .SetResultTransformer(Transformers.AliasToBean<AuctionStatus>())
      .UniqueResult<AuctionStatus>();

    status.TimeRemaining = this.timeRemaining(status.AuctionEnds);
    status.NumberOfBids = this._bidHistory.numberOfBidsFor(auctionId);

    return status;
  }

  private timeRemaining(auctionEnds: Date) {
    if (this._clock.time() < auctionEnds)
      return auctionEnds.Subtract(this._clock.time());
    else return new TimeSpan();
  }
}
