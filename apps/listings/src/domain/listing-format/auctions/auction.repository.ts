import { Auction } from './auction';

export interface IAuctionRepository {
  add(item: Auction): void;
  findBy(id: string): Auction;
}
