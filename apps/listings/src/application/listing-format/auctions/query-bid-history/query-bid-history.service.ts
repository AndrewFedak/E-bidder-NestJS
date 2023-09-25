import { Inject } from '@nestjs/common';

import { DYNAMODB_TOKEN } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { BidInformation } from './bid-information';

/*
The other report that the application needs to give access to is the history of bids against the auction. 

Again, you don’t want to expose your domain objects, so you will create a specific DTO, shown in Listing 21‐63. 

Even though it closely resembles the real Bid domain object, the BidInformation class represents a completely different concern z
and will not be affected if the Bid value object evolves. 
*/

/* 
Again, the query service, Listing 21‐64, that pulls back information on the bids placed against an auction
needs to go directly to the database to pull back a view because of the encapsulated domain model.
*/

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
