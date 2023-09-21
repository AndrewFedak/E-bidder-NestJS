import { Entity } from 'apps/listings/src/infrastructure/entity';

import { AutomaticBidder } from './automatic-bidder';

import { BidPlaced } from '../../../cqrs/events/auctions/bid-placed.event';
import { OutBid } from './out-bid';

import { Money } from '../../money';
import { WinningBid } from './winning-bid';
import { Offer } from './offer';

export class Auction extends Entity<string> {
  private winningBid: WinningBid;
  private hasEnded: boolean;

  constructor(
    id: string,
    private listingId: string,
    private startingPrice: Money,
    private endsAt: Date,
  ) {
    super();
    this.id = id;
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

  placeBidFor(offer: Offer, currentTime: Date) {
    if (this.stillInProgress(currentTime)) {
      if (this.firstOffer()) this.placeABidForTheFirst(offer);
      else if (this.bidderIsIncreasingMaximumBidToNew(offer))
        this.winningBid = this.winningBid.raiseMaximumBidTo(offer.maximumBid);
      else if (this.winningBid.canBeExceededBy(offer.maximumBid)) {
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

  private placeABidForTheFirst(offer: Offer): void {
    if (offer.maximumBid.isGreaterThanOrEqualTo(this.startingPrice))
      this.place(
        new WinningBid(
          offer.bidderId,
          offer.maximumBid,
          this.startingPrice,
          offer.timeOfOffer,
        ),
      );
  }

  private place(newBid: WinningBid): void {
    if (!this.firstOffer() && this.winningBid.wasMadeBy(newBid.bidderId)) {
      DomainEvents.Raise(new OutBid(this.id, this.winningBid.bidderId));
    }

    this.winningBid = newBid;
    DomainEvents.Raise(
      new BidPlaced(
        this.id,
        newBid.bidderId,
        newBid.currentAuctionPrice.amount,
        newBid.timeOfBid,
      ),
    );
  }
}
