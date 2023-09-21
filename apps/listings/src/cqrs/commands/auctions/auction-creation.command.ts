export class AuctionCreation {
  constructor(
    public startingPrice: number,
    public sellerId: string,
    public endsAt: Date,
  ) {}
}
