import { Offer } from './offer';
import { WinningBid } from './winning-bid';

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
    let bid: WinningBid;

    if (winningBid.canBeExceededBy(offer.maximumBid)) {
      bid = new WinningBid(
        offer.bidderId,
        offer.maximumBid,
        winningBid.currentAuctionPrice.bidIncrement(),
        offer.timeOfOffer,
      );
    } else {
      bid = new WinningBid(
        offer.bidderId,
        offer.maximumBid,
        offer.maximumBid,
        offer.timeOfOffer,
      );
    }

    return bid;
  }
}
