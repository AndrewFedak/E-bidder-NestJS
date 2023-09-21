import { IClock } from '@app/listings/src/infrastructure/clock';

import { IBidHistoryRepository } from '@app/listings/src/domain/listing-format/auctions/bid-history/bid-history.repository';

import { AuctionStatus } from './auction-status';

export class AuctionStatusQuery {
  constructor(
    private readonly _session: ISession,
    private readonly _bidHistory: IBidHistoryRepository,
    private readonly _clock: IClock,
  ) {}

  auctionStatus(auctionId: string): AuctionStatus {
    const status = this._session
      .CreateSQLQuery(
        `select Id, CurrentPrice, BidderMemberId as WinningBidderId, AuctionEnds from Auctions Where Id = '${auctionId}'`,
      )
      .SetResultTransformer(Transformers.AliasToBean<AuctionStatus>())
      .UniqueResult<AuctionStatus>();

    status.TimeRemaining = TimeRemaining(status.AuctionEnds);
    status.NumberOfBids = this._bidHistory.noOfBidsFor(auctionId);

    return status;
  }

  timeRemaining(auctionEnds: Date) {
    if (this._clock.time() < auctionEnds)
      return auctionEnds.Subtract(this._clock.time());
    else return new TimeSpan();
  }
}
