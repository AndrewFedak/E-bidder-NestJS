import { ValueObject } from '@app/listings/src/infrastructure/value-object';

import { Money } from '@app/listings/src/domain/money';

export class Price extends ValueObject<Price> {
  constructor(public amount: Money) {
    super();
  }

  bidIncrement(): Money {
    if (
      this.amount.isGreaterThanOrEqualTo(new Money(0.01)) &&
      this.amount.isLessThanOrEqualTo(new Money(0.99))
    )
      return this.amount.add(new Money(0.05));

    if (
      this.amount.isGreaterThanOrEqualTo(new Money(1.0)) &&
      this.amount.isLessThanOrEqualTo(new Money(4.99))
    )
      return this.amount.add(new Money(0.2));

    if (
      this.amount.isGreaterThanOrEqualTo(new Money(5.0)) &&
      this.amount.isLessThanOrEqualTo(new Money(14.99))
    )
      return this.amount.add(new Money(0.5));

    return this.amount.add(new Money(1.0));
  }

  canBeExceededBy(offer: Money): boolean {
    return offer.isGreaterThanOrEqualTo(this.bidIncrement());
  }

  protected override getAttributesToIncludeInEqualityCheck() {
    return [this.amount];
  }
}
