import { Auction } from '../domain/models/listing-format/auctions/auction';
import { IAuctionRepository } from '../domain/models/listing-format/auctions/iauction-repository';

export class AuctionRepository implements IAuctionRepository {
  constructor(private readonly _session: ISession) {}
  add(auction: Auction): void {
    this._session.Save(auction);
  }
  findBy(id: string): Auction {
    return this._session.Get(id);
  }
}
