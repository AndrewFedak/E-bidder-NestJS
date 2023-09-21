import { Auction } from '@app/listings/src/domain/listing-format/auctions/auction.entity';

import { IAuctionRepository } from '@app/listings/src/domain/listing-format/auctions/auction.repository';

export class AuctionRepository implements IAuctionRepository {
  constructor(private readonly _session: ISession) {}
  add(auction: Auction): void {
    this._session.Save(auction);
  }
  findBy(id: string): Auction {
    return this._session.Get(id);
  }
}
