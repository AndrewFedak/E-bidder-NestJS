import { Listing } from './listing.entity';

export const LISTING_REPOSITORY_TOKEN = 'LISTING_REPOSITORY_TOKEN';

export interface IListingRepository {
  add(listing: Listing): void;
  findBy(id: string): Listing;
}
