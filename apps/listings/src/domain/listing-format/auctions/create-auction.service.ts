import { v4 as uuid } from 'uuid';

import { IListingRepository } from '@app/listings/src/domain/listings/listing.repository';
import {
  ListingFormat,
  FormatType,
} from '@app/listings/src/domain/listings/listing-format';
import { Listing } from '@app/listings/src/domain/listings/listing.entity';

import { Auction } from '@app/listings/src/domain/listing-format/auctions/auction.entity';
import { IAuctionRepository } from '@app/listings/src/domain/listing-format/auctions/auction.repository';

import { Money } from '@app/listings/src/domain/money';

import { ISellerService } from '@app/listings/src/domain/sellers/seller.service';

import { AuctionCreation } from '@app/listings/src/messages/commands/auctions/auction-creation.command';

export class CreateAuctionService {
  // private IDocumentSession _unitOfWork;

  constructor(
    private _auctions: IAuctionRepository,
    private _sellerService: ISellerService,
    private _listings: IListingRepository,
  ) {}

  create(command: AuctionCreation): string {
    const auctionId = uuid();
    const listingId = uuid();
    const startingPrice = new Money(command.startingPrice);

    const listing = new Listing(
      listingId,
      command.sellerId,
      new ListingFormat(auctionId, FormatType.Auction),
    );

    const auction = new Auction(
      auctionId,
      listingId,
      startingPrice,
      command.endsAt,
    );

    // Can seller list
    const seller = this._sellerService.getSeller(command.sellerId);

    if (seller != null && seller.canList) {
      this._listings.add(listing);
      this._auctions.add(auction);
    }

    // _unitOfWork.SaveChanges();

    return auctionId;
  }
}
