import { BidInformation } from './bid-information';

export class BidHistoryQuery {
  constructor(private readonly _session: ISession) {}

  public bidHistoryFor(auctionId: string): BidInformation[] {
    const statuses = this._session
      .CreateSQLQuery(
        `SELECT [BidderId] as Bidder,[Bid] as AmountBid ,TimeOfBid FROM [BidHistory] Where AuctionId = '${auctionId}' Order By Bid Desc, TimeOfBid Asc`,
      )
      .SetResultTransformer(Transformers.AliasToBean<BidInformation>());

    return statuses;
  }
}
