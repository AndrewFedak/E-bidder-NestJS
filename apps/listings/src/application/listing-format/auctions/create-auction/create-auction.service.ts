import { v4 as uuid } from 'uuid';
import { Inject } from '@nestjs/common';

import {
  ListingFormat,
  FormatType,
} from '@app/listings/src/domain/listings/listing-format';

import {
  IListingRepository,
  LISTING_REPOSITORY_TOKEN,
} from '@app/listings/src/domain/listings/listing.repository';
import { Listing } from '@app/listings/src/domain/listings/listing.entity';

import {
  IAuctionRepository,
  AUCTION_REPOSITORY_TOKEN,
} from '@app/listings/src/domain/listing-format/auctions/models/auction/auction.repository';
import { Auction } from '@app/listings/src/domain/listing-format/auctions/models/auction/auction.entity';

import { Money } from '@app/listings/src/domain/money';

import { SellerService } from '@app/listings/src/domain/sellers/seller.service';

import { CreateAuctionDto } from '@app/listings/src/application/listing-format/auctions/create-auction/auction-creation.dto';

export class CreateAuctionService {
  constructor(
    @Inject(AUCTION_REPOSITORY_TOKEN) private _auctions: IAuctionRepository,
    @Inject(LISTING_REPOSITORY_TOKEN) private _listings: IListingRepository,
    private _sellerService: SellerService,
  ) {}

  create(createAuctionDto: CreateAuctionDto): string {
    const auctionId = uuid();
    const listingId = uuid();
    const startingPrice = new Money(createAuctionDto.startingPrice);

    const listing = new Listing(
      listingId,
      createAuctionDto.sellerId,
      new ListingFormat(auctionId, FormatType.Auction),
    );

    const auction = new Auction(
      auctionId,
      listingId,
      startingPrice,
      createAuctionDto.endsAt,
    );

    // Can seller list
    const seller = this._sellerService.getSeller(createAuctionDto.sellerId);

    if (seller != null && seller.canList) {
      this._listings.add(listing);
      this._auctions.add(auction);
    }

    // _unitOfWork.SaveChanges(); Transaction

    return auctionId;
  }
}
