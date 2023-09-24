import { ValueObject } from '@app/listings/src/infrastructure/value-object';

import { Money } from '@app/listings/src/domain/money/money';
import { Price } from '../price';
import { WinningBidSnapshot } from './winning-bid-snapshot';

type WinningBidConstructor =
  | WinningBidSnapshot
  | {
      auctionId: string;
      bidderId: string;
      maximumBid: Money;
      bid: Money;
      timeOfBid: Date;
    };

export class WinningBid extends ValueObject<WinningBid> {
  public auctionId: string;
  public bidderId: string;
  public maximumBid: Money;
  public timeOfBid: Date;
  public currentAuctionPrice: Price;

  constructor(input: WinningBidConstructor) {
    super();

    if (input instanceof WinningBidSnapshot) {
      this.initFromSnapshot(input);
    } else {
      this.auctionId = input.auctionId;
      this.bidderId = input.bidderId;
      this.maximumBid = input.maximumBid;
      this.currentAuctionPrice = new Price(input.bid);
      this.timeOfBid = input.timeOfBid;
    }
  }

  raiseMaximumBidTo(newAmount: Money): WinningBid {
    if (newAmount.isGreaterThan(this.maximumBid))
      return new WinningBid({
        auctionId: this.auctionId,
        bidderId: this.bidderId,
        maximumBid: newAmount,
        bid: this.currentAuctionPrice.amount,
        timeOfBid: new Date(),
      });
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

  getSnapshot(): WinningBidSnapshot {
    const snapshot = new WinningBidSnapshot();

    snapshot.auctionId = this.auctionId;
    snapshot.bidderId = this.bidderId;
    snapshot.biddersMaximumBid = this.maximumBid.getSnapshot().value;
    snapshot.currentPrice = this.currentAuctionPrice.amount.getSnapshot().value;
    snapshot.timeOfBid = this.timeOfBid;

    return snapshot;
  }

  private initFromSnapshot(bidSnapShot: WinningBidSnapshot) {
    return new WinningBid({
      auctionId: bidSnapShot.auctionId,
      bidderId: bidSnapShot.bidderId,
      maximumBid: new Money(bidSnapShot.biddersMaximumBid),
      bid: new Money(bidSnapShot.currentPrice),
      timeOfBid: bidSnapShot.timeOfBid,
    });
  }
}
