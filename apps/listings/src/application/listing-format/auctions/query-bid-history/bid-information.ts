export class BidInformation {
  constructor(
    public bidderId: string,
    public amountBid: number,
    public currency: string,
    public timeOfBid: Date,
  ) {}
}
