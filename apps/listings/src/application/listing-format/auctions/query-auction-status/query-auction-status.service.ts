import { Inject } from '@nestjs/common';

import { Clock } from '@app/listings/src/infrastructure/clock';
import { DYNAMODB_TOKEN } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { IBidHistoryRepository } from '@app/listings/src/domain/listing-format/auctions/models/bids/bid-history.repository';

import { AuctionStatus } from './auction-status';

// No need to extend existing (to not pollute ad-hoc queries) repository methods
// and create new for methods for reporting/UI interface that maybe be unique for specific current requirement and require specific attributes to be retrieved from query

// Thus, we may build that reporting query within Service just with access to Persistence framework because excessive complexity of abstracting such method may be
//    quite complex (a lot of specifically defined methods may add excessive complexity to codebase, thus redability and maintainability would struggle)
//    inefficient (somehow generalized methods could fetch some unnessesary data that would be filtered here,
//                  but they went through a network thus cost of transfering excessive attributes could badly affect performance)

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
