import { ValueObject } from 'apps/listings/src/infrastructure/value-object';
import { Money } from '../../../../money';

export class Bid extends ValueObject<Bid> {
  private id: string;

  constructor(
    public auctionId: string,
    public bidderId: string,
    public amountBid: Money,
    public timeOfBid: Date,
  ) {
    super();
  }
  protected override getAttributesToIncludeInEqualityCheck() {
    return [
      this.auctionId,
      this.bidderId,
      this.amountBid,
      this.timeOfBid.toString(),
    ];
  }
}
