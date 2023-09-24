import { WinningBidSnapshot } from '../winning-bid/winning-bid-snapshot';

export class AuctionSnapshot {
  public id: string;
  public listingId: string;
  public startingPrice: number;
  public endsAt: Date;
  public winningBid: WinningBidSnapshot;
  public version: number;
}
