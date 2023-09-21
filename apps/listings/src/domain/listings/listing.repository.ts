import { Listing } from './listing.entity';

export interface IListingRepository {
  add(listing: Listing): void;
  findBy(id: string): Listing;
}
