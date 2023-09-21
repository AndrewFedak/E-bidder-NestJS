import { Auction } from './auction.entity';

export interface IAuctionRepository {
  add(item: Auction): void;
  findBy(id: string): Auction;
}
