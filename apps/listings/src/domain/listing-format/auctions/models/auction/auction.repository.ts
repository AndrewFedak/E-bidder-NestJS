import { Auction } from './auction.entity';

export const AUCTION_REPOSITORY_TOKEN = 'AUCTION_REPOSITORY_TOKEN';

export interface IAuctionRepository {
  add(item: Auction): void;
  findBy(id: string): Auction;
}
