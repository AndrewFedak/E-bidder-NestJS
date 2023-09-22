import { Inject, ClassProvider } from '@nestjs/common';

import { DYNAMODB_TOKEN } from './dynamodb/dynamodb.module';

import {
  IListingRepository,
  LISTING_REPOSITORY_TOKEN,
} from '../domain/listings/listing.repository';
import { Listing } from '../domain/listings/listing.entity';

class ListingRepositoryImplementation implements IListingRepository {
  constructor(@Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: any) {}
  add(listing: Listing): void {
    throw new Error('Method not implemented.');
  }
  findBy(id: string): Listing {
    throw new Error('Method not implemented.');
  }
}

export const ListingRepository: ClassProvider<ListingRepositoryImplementation> =
  {
    provide: LISTING_REPOSITORY_TOKEN,
    useClass: ListingRepositoryImplementation,
  };
