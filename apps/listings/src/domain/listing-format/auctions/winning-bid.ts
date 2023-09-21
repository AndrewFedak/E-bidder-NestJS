import { ValueObject } from 'apps/listings/src/infrastructure/value-object';
import { Money } from '../../money';
import { Price } from './price';

export class WinningBid extends ValueObject<WinningBid> {
  public bidderId: string;
  public maximumBid: Money;
  public timeOfBid: Date;
  public currentAuctionPrice: Price;

  constructor(
    bidderId: string,
    maximumBid: Money,
    bid: Money,
    timeOfBid: Date,
  ) {
    super();
    this.bidderId = bidderId;
    this.maximumBid = maximumBid;
    this.timeOfBid = timeOfBid;
    this.currentAuctionPrice = new Price(bid);
  }

  raiseMaximumBidTo(newAmount: Money): WinningBid {
    if (newAmount.isGreaterThan(this.maximumBid))
      return new WinningBid(
        this.bidderId,
        newAmount,
        this.currentAuctionPrice.amount,
        new Date(),
      );
    else
      throw new Error(
        'Maximum bid increase must be larger than current maximum bid.',
      );
  }

  wasMadeBy(bidderId: string): boolean {
    return this.bidderId === bidderId;
  }

  canBeExceededBy(offer: Money): boolean {
    return this.currentAuctionPrice.canBeExceededBy(offer);
  }

  hasNotReachedMaximumBid(): boolean {
    return this.maximumBid.isGreaterThan(this.currentAuctionPrice.amount);
  }

  protected override getAttributesToIncludeInEqualityCheck() {
    return [
      this.bidderId,
      this.maximumBid,
      this.timeOfBid,
      this.currentAuctionPrice,
    ];
  }
}
