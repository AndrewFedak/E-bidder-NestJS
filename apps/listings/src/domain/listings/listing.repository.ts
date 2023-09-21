import { Listing } from './listing';

export interface IListingRepository {
  add(listing: Listing): void;
  findBy(id: string): Listing;
}
