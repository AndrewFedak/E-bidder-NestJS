import { Action } from 'apps/listings/src/infrastructure/action';
import { IClock } from 'apps/listings/src/infrastructure/clock';

import { IBidHistoryRepository } from 'apps/listings/src/domain/models/listing-format/auctions/bid-history/ibid-history.repository';
import { IAuctionRepository } from 'apps/listings/src/domain/models/listing-format/auctions/iauction-repository';
import { IMemberService } from 'apps/listings/src/domain/models/members/imember-service';

import { Bid } from 'apps/listings/src/domain/models/listing-format/auctions/bid-history/bid';
import { Offer } from 'apps/listings/src/domain/models/listing-format/auctions/offer';
import { Money } from 'apps/listings/src/domain/models/money';

import { BidPlaced } from 'apps/listings/src/domain/models/listing-format/auctions/bid-placed';
import { OutBid } from 'apps/listings/src/domain/models/listing-format/auctions/out-bid';

export class BidOnAuctionService {
  constructor(
    private _auctions: IAuctionRepository,
    private _bidHistory: IBidHistoryRepository,
    private _memberService: IMemberService,
    private _clock: IClock,
  ) {}

  bid(auctionId: string, memberId: string, amount: number): void {
    DomainEvents.Register(this.outBid());
    DomainEvents.Register(this.bidPlaced());

    const member = this._memberService.getMember(memberId);

    if (member.canBid) {
      const auction = this._auctions.findBy(auctionId);
      const bidAmount = new Money(amount);
      const offer = new Offer(memberId, bidAmount, this._clock.time());

      auction.placeBidFor(offer, this._clock.time());
    }
  }

  private bidPlaced(): Action<BidPlaced> {
    return (e) => {
      const bidEvent = new Bid(
        e.auctionId,
        e.bidderId,
        e.amountBid,
        e.timeOfBid,
      );

      this._bidHistory.add(bidEvent);
    };
  }

  private outBid(): Action<OutBid> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (e) => {
      // Add message to Member message board.
    };
  }
}
