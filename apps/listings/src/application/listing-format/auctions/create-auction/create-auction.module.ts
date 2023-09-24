import { Module } from '@nestjs/common';

import { DynamoDBModule } from '@app/listings/src/infrastructure/config/dynamodb/dynamodb.module';

import { AuctionRepository } from '@app/listings/src/infrastructure/auction.repository.impl';
import { ListingRepository } from '@app/listings/src/infrastructure/listing.repository.impl';

import { SellerService } from '@app/listings/src/domain/sellers/seller.service';

import { CreateAuctionService } from './create-auction.service';

@Module({
  imports: [DynamoDBModule],
  providers: [
    CreateAuctionService,
    AuctionRepository,
    ListingRepository,
    SellerService,
  ],
  exports: [CreateAuctionService],
})
export class CreateAuctionModule {}
