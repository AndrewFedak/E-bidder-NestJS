import { v4 as uuid } from 'uuid';

import { IAuctionRepository } from 'apps/listings/src/domain/models/listing-format/auctions/iauction-repository';
import { IListingRepository } from 'apps/listings/src/domain/models/listings/ilisting-repository';

import { Auction } from 'apps/listings/src/domain/models/listing-format/auctions/auction';
import { Listing } from 'apps/listings/src/domain/models/listings/listing';

import {
  ListingFormat,
  FormatType,
} from 'apps/listings/src/domain/models/listings/listing-format';

import { Money } from 'apps/listings/src/domain/models/money';

import { ISellerService } from 'apps/listings/src/domain/models/sellers/iseller-service';
import { AuctionCreation } from '../../../cqrs/commands/auctions/auction-creation.command';

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
