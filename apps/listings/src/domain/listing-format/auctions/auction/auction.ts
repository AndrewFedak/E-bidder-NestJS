import { Entity } from '@app/listings/src/infrastructure/entity';
import { DomainEvents } from '@app/listings/src/infrastructure/domain-events';

import { BidPlaced } from '@app/listings/src/messages/events/auctions/bid-placed.event';
import { OutBid } from '@app/listings/src/messages/events/auctions/out-bid.event';

import { Money } from '@app/listings/src/domain/money/money';
import { WinningBid } from '@app/listings/src/domain/listing-format/auctions/winning-bid/winning-bid';
import { Offer } from '@app/listings/src/domain/listing-format/auctions/offer';

import { AutomaticBidder } from './automatic-bidder';
import { AuctionSnapshot } from './auction-snapshot';

type AuctionConstructor =
  | AuctionSnapshot
  | {
      id: string;
      listingId: string;
      startingPrice: Money;
      endsAt: Date;
    };

export class Auction extends Entity<string> {
  private listingId: string;
  private startingPrice: Money;
  private endsAt: Date;
  private winningBid: WinningBid;
  private hasEnded: boolean;

  constructor(input: AuctionConstructor) {
    super();
    if (input instanceof AuctionSnapshot) {
      this.initFromSnapshot(input);
    } else {
      this.id = input.id;
      this.listingId = input.listingId;
      this.startingPrice = input.startingPrice;
      this.endsAt = input.endsAt;
    }
  }

  reduceTheStartingPrice(): void {
    // Only if no bids and more than 12 hours left
  }

  // Fixed Price or
  // Auction
  // Once someone bids, the Buy it now option disappears.
  // The listing then proceeds as a regular auction-style listing, with the item going to the highest bidder.
  // (If the auction has a reserve price, the Buy it now option will be available until the reserve price is met.)
  // http://sellercentre.ebay.co.uk/add-buy-it-now-price-auction

  private stillInProgress(currentTime: Date): boolean {
    return this.endsAt > currentTime;
  }

  canPlaceBid(): boolean {
    return this.hasEnded == false;
  }

  placeBidFor(offer: Offer, currentTime: Date): void {
    if (this.stillInProgress(currentTime)) {
      if (this.firstOffer()) {
        this.placeABidForTheFirst(offer);
      } else if (this.bidderIsIncreasingMaximumBidToNew(offer)) {
        this.winningBid = this.winningBid.raiseMaximumBidTo(offer.maximumBid);
      } else if (this.winningBid.canBeExceededBy(offer.maximumBid)) {
        const newBids = new AutomaticBidder().generateNextSequenceOfBidsAfter(
          offer,
          this.winningBid,
        );

        newBids.forEach((bid) => {
          this.place(bid);
        });
      }
    }
  }

  private bidderIsIncreasingMaximumBidToNew(offer: Offer): boolean {
    return (
      this.winningBid.wasMadeBy(offer.bidderId) &&
      offer.maximumBid.isGreaterThan(this.winningBid.maximumBid)
    );
  }

  private firstOffer(): boolean {
    return this.winningBid == null;
  }

  private hasACurrentBid(): boolean {
    return this.winningBid != null;
  }

  private placeABidForTheFirst(offer: Offer): void {
    if (offer.maximumBid.isGreaterThanOrEqualTo(this.startingPrice))
      this.place(
        new WinningBid({
          auctionId: this.id,
          bidderId: offer.bidderId,
          maximumBid: offer.maximumBid,
          bid: this.startingPrice,
          timeOfBid: offer.timeOfOffer,
        }),
      );
  }

  private place(newBid: WinningBid): void {
    if (!this.firstOffer() && this.winningBid.wasMadeBy(newBid.bidderId)) {
      DomainEvents.raise(new OutBid(this.id, this.winningBid.bidderId));
    }

    this.winningBid = newBid;
    DomainEvents.raise(
      new BidPlaced(
        this.id,
        newBid.bidderId,
        newBid.currentAuctionPrice.amount,
        newBid.timeOfBid,
      ),
    );
  }

  getSnapshot(): AuctionSnapshot {
    const snapshot = new AuctionSnapshot();
    snapshot.id = this.id;
    snapshot.listingId = this.listingId;
    snapshot.startingPrice = this.startingPrice.getSnapshot().value;
    snapshot.endsAt = this.endsAt;
    snapshot.version = this.version;

    if (this.hasACurrentBid())
      snapshot.winningBid = this.winningBid.getSnapshot();

    return snapshot;
  }

  private initFromSnapshot(snapshot: AuctionSnapshot): void {
    this.id = snapshot.id;
    this.startingPrice = new Money(snapshot.startingPrice);
    this.endsAt = snapshot.endsAt;
    this.listingId = snapshot.listingId;
    this.version = snapshot.version;

    if (snapshot.winningBid != null)
      this.winningBid = new WinningBid(snapshot.winningBid);
  }
}
