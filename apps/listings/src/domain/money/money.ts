import { ValueObject } from '@app/listings/src/infrastructure/value-object';

import { MoneyCannotBeANegativeValueException } from './money-cannot-be-negative.exception';
import { MoreThanTwoDecimalPlacesInMoneyValueException } from './more-than-two-decimal-places-in-money-value.exception';
import { MoneySnapshot } from './money-snapshot';

export class Money extends ValueObject<Money> {
  protected value: number;

  constructor(value: number) {
    super();
    this.throwExceptionIfNotValid(value);

    this.value = value;
  }

  private throwExceptionIfNotValid(value: number): void {
    if (value % 0.01 !== 0) {
      throw new MoreThanTwoDecimalPlacesInMoneyValueException();
    }

    if (value < 0) {
      throw new MoneyCannotBeANegativeValueException();
    }
  }
  add(money: Money): Money {
    return new Money(this.value + money.value);
  }
  isGreaterThan(money: Money): boolean {
    return this.value > money.value;
  }
  isGreaterThanOrEqualTo(money: Money): boolean {
    return this.value > money.value || this.equals(money);
  }
  isLessThanOrEqualTo(money: Money): boolean {
    return this.value < money.value || this.equals(money);
  }
  toString(): string {
    return `${this.value}`;
  }
  protected override getAttributesToIncludeInEqualityCheck() {
    return [this.value];
  }

  getSnapshot(): MoneySnapshot {
    return new MoneySnapshot(this.value);
  }
}
