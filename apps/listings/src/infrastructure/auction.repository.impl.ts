import { ClassProvider, Inject } from '@nestjs/common';

import { Auction } from '@app/listings/src/domain/listing-format/auctions/models/auction/auction.entity';

import {
  IAuctionRepository,
  AUCTION_REPOSITORY_TOKEN,
} from '../domain/listing-format/auctions/models/auction/auction.repository';

import { DYNAMODB_TOKEN } from './dynamodb/dynamodb.module';

class AuctionRepositoryImplementation implements IAuctionRepository {
  constructor(@Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: any) {}

  add(auction: Auction): void {
    this._dynamoDB.Save(auction);
  }
  findBy(id: string): Auction {
    return this._dynamoDB.Get(id);
  }
}

export const AuctionRepository: ClassProvider<AuctionRepositoryImplementation> =
  {
    provide: AUCTION_REPOSITORY_TOKEN,
    useClass: AuctionRepositoryImplementation,
  };
