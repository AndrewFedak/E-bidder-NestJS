import { IClock } from 'apps/listings/src/infrastructure/clock';
import {
  DomainEvents,
  EventRegister,
} from 'apps/listings/src/infrastructure/domain-events';

import { IAuctionRepository } from './auction.repository';
import { IBidHistoryRepository } from './bid-history/bid-history.repository';
import { IMemberService } from '../../members/member.service';

import { Bid } from './bid-history/bid';
import { Offer } from './offer';
import { Money } from '../../money';

import { BidPlaced } from 'apps/listings/src/cqrs/events/auctions/bid-placed.event';
import { OutBid } from 'apps/listings/src/cqrs/events/auctions/out-bid.event';

export class BidOnAuctionService {
  constructor(
    private _auctions: IAuctionRepository,
    private _bidHistory: IBidHistoryRepository,
    private _memberService: IMemberService,
    private _clock: IClock,
  ) {}

  bid(auctionId: string, memberId: string, amount: number): void {
    const bidPlacedEventReg = DomainEvents.register(this.bidPlaced());
    const outBidEventReg = DomainEvents.register(this.outBid());

    try {
      const member = this._memberService.getMember(memberId);

      if (member.canBid) {
        const auction = this._auctions.findBy(auctionId);
        const bidAmount = new Money(amount);
        const offer = new Offer(memberId, bidAmount, this._clock.time());

        auction.placeBidFor(offer, this._clock.time());
      }
    } finally {
      bidPlacedEventReg.dispose();
      outBidEventReg.dispose();
    }
  }

  private bidPlaced(): EventRegister<BidPlaced> {
    return {
      eventType: BidPlaced,
      action: (e) => {
        const bidEvent = new Bid(
          e.auctionId,
          e.bidderId,
          e.amountBid,
          e.timeOfBid,
        );

        this._bidHistory.add(bidEvent);
      },
    };
  }

  private outBid(): EventRegister<OutBid> {
    return {
      eventType: OutBid,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: (_e) => {
        // Add message to Member message board.
      },
    };
  }
}
