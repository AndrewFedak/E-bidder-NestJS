export abstract class Entity<TId> {
  protected id: TId;
  protected version: number;
}
