import { Inject } from '@nestjs/common';

import { DYNAMODB_TOKEN } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { BidInformation } from './bid-information';

export class QueryBidHistory {
  constructor(@Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: any) {}

  public bidHistoryFor(auctionId: string): BidInformation[] {
    const statuses = this._dynamoDB
      .CreateSQLQuery(
        `SELECT [BidderId] as Bidder,[Bid] as AmountBid ,TimeOfBid FROM [BidHistory] Where AuctionId = '${auctionId}' Order By Bid Desc, TimeOfBid Asc`,
      )
      .SetResultTransformer(Transformers.AliasToBean<BidInformation>());

    return statuses;
  }
}
