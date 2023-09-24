import { Auction } from './auction';

export const AUCTION_REPOSITORY_TOKEN = 'AUCTION_REPOSITORY_TOKEN';

export interface IAuctionRepository {
  add(item: Auction): Promise<void>;
  findBy(id: string): Promise<Auction>;
}
