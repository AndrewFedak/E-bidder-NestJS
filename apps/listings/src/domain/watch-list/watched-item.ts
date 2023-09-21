export class WatchedItem {
  private note: string;

  constructor(
    public Id: string,
    public ListingId: string,
    public MemberId: string,
  ) {}
}
