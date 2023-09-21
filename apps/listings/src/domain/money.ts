import { ValueObject } from '../../infrastructure/value-object';

export class Money extends ValueObject<Money> {
  protected value: number;

  constructor(value: number) {
    super();
    this.throwExceptionIfNotValid(value);

    this.value = value;
  }

  private throwExceptionIfNotValid(value: number): void {
    if (value % 0.01 != 0) {
      // throw new MoreThanTwoDecimalPlacesInMoneyValueException();
      throw new Error();
    }

    if (value < 0) {
      // throw new MoneyCannotBeANegativeValueException();
      throw new Error();
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
}
