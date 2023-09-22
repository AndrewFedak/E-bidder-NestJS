import { Bid } from '../models/bid';

export const BID_HISTORY_REPOSITORY_TOKEN = 'BID_HISTORY_REPOSITORY_TOKEN';

export interface IBidHistoryRepository {
  noOfBidsFor(autionId: string): number;
  add(bid: Bid): void;
}
