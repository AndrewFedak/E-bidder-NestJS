import { Bid } from './bid';

export interface IBidHistoryRepository {
  noOfBidsFor(autionId: string): number;
  add(bid: Bid): void;
}
