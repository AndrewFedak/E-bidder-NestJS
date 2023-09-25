import { Bid } from './bid';

export const BID_HISTORY_REPOSITORY_TOKEN = 'BID_HISTORY_REPOSITORY_TOKEN';

export interface IBidHistoryRepository {
  numberOfBidsFor(autionId: string): Promise<number>;
  add(bid: Bid): Promise<void>;
}
