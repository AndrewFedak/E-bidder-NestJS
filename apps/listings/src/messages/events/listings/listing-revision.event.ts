export class ListingRevisionEvent {
  constructor(
    private itemId: string,
    private date: Date,
    private revisedInformation: string,
  ) {}
}
