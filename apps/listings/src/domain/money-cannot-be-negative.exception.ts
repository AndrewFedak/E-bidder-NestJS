export class MoneyCannotBeANegativeValueException extends Error {
  constructor(message: string) {
    super(message);
  }
}
