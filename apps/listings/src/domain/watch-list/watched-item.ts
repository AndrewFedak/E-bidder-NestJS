export class WatchedItem {
  private note: string;

  constructor(
    public id: string,
    public listingId: string,
    public memberId: string,
  ) {}
}
