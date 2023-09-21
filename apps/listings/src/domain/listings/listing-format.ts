export enum FormatType {
  Auction,
  FixedPrice,
}

export class ListingFormat {
  constructor(
    public formatId: string,
    public format: FormatType,
  ) {}
}
