import { Offer } from '@app/listings/src/domain/listing-format/auctions/offer';
import { WinningBid } from '@app/listings/src/domain/listing-format/auctions/winning-bid';

// Domain service (Chapter 17 of DDD book)
// A primary concern for domain services is carrying out some behavior involving entities or value objects.
export class AutomaticBidder {
  generateNextSequenceOfBidsAfter(
    offer: Offer,
    currentWinningBid: WinningBid,
  ): WinningBid[] {
    const bids: WinningBid[] = [];

    if (currentWinningBid.maximumBid.isGreaterThanOrEqualTo(offer.maximumBid)) {
      const bidFromOffer = new WinningBid(
        offer.bidderId,
        offer.maximumBid,
        offer.maximumBid,
        offer.timeOfOffer,
      );
      bids.push(bidFromOffer);

      bids.push(
        this.calculateNextBid(
          bidFromOffer,
          new Offer(
            currentWinningBid.bidderId,
            currentWinningBid.maximumBid,
            currentWinningBid.timeOfBid,
          ),
        ),
      );
    } else {
      if (currentWinningBid.hasNotReachedMaximumBid()) {
        const currentBiddersLastBid = new WinningBid(
          currentWinningBid.bidderId,
          currentWinningBid.maximumBid,
          currentWinningBid.maximumBid,
          currentWinningBid.timeOfBid,
        );
        bids.push(currentBiddersLastBid);

        bids.push(this.calculateNextBid(currentBiddersLastBid, offer));
      } else {
        bids.push(
          new WinningBid(
            offer.bidderId,
            currentWinningBid.currentAuctionPrice.bidIncrement(),
            offer.maximumBid,
            offer.timeOfOffer,
          ),
        );
      }
    }

    return bids;
  }

  private calculateNextBid(winningBid: WinningBid, offer: Offer): WinningBid {
    if (winningBid.canBeExceededBy(offer.maximumBid)) {
      return new WinningBid(
        offer.bidderId,
        offer.maximumBid,
        winningBid.currentAuctionPrice.bidIncrement(),
        offer.timeOfOffer,
      );
    }

    return new WinningBid(
      offer.bidderId,
      offer.maximumBid,
      offer.maximumBid,
      offer.timeOfOffer,
    );
  }
}
