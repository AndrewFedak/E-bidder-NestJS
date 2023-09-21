export class AuctionStatus {
  constructor(
    public id: string,
    public currentPrice: number,
    public auctionEnds: Date,
    public winningBidderId: string,
    public numberOfBids: number,
    public timeRemaining: Date,
  ) {}
}
