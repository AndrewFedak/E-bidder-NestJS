import { ValueObject } from '@app/listings/src/infrastructure/value-object';

import { Money } from '@app/listings/src/domain/money';

export class Offer extends ValueObject<Offer> {
  constructor(
    public bidderId: string,
    public maximumBid: Money,
    public timeOfOffer: Date,
  ) {
    super();
  }

  protected override getAttributesToIncludeInEqualityCheck() {
    return [this.bidderId, this.maximumBid, this.timeOfOffer];
  }
}
