import { Inject } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Clock } from '@app/listings/src/infrastructure/clock';
import {
  DomainEvents,
  EventRegister,
} from '@app/listings/src/infrastructure/domain-events';

import {
  IAuctionRepository,
  AUCTION_REPOSITORY_TOKEN,
} from '@app/listings/src/domain/listing-format/auctions/auction/auction.repository';
import {
  IBidHistoryRepository,
  BID_HISTORY_REPOSITORY_TOKEN,
} from '@app/listings/src/domain/listing-format/auctions/bids/bid-history.repository';

import { MemberService } from '@app/listings/src/domain/members/member.service';

import { Bid } from '@app/listings/src/domain/listing-format/auctions/bids/bid';
import { Offer } from '@app/listings/src/domain/listing-format/auctions/offer';
import { Money } from '@app/listings/src/domain/money/money';

import { BidPlaced } from '@app/listings/src/messages/events/auctions/bid-placed.event';
import { OutBid } from '@app/listings/src/messages/events/auctions/out-bid.event';

export class BidOnAuctionService {
  constructor(
    @Inject(AUCTION_REPOSITORY_TOKEN) private _auctions: IAuctionRepository,
    @Inject(BID_HISTORY_REPOSITORY_TOKEN)
    private _bidHistory: IBidHistoryRepository,
    private _memberService: MemberService,
    private _clock: Clock,
  ) {}

  async bid(
    auctionId: string,
    memberId: string,
    amount: number,
  ): Promise<void> {
    const bidPlacedEventReg = DomainEvents.register(this.bidPlaced());
    const outBidEventReg = DomainEvents.register(this.outBid());

    try {
      const member = await this._memberService.getMember(memberId);

      if (member.canBid) {
        const auction = await this._auctions.findBy(auctionId);
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
      event: BidPlaced,
      action: (e) => {
        const bid = new Bid(
          uuid(),
          e.auctionId,
          e.bidderId,
          e.amountBid,
          e.timeOfBid,
        );

        this._bidHistory.add(bid);
      },
    };
  }

  private outBid(): EventRegister<OutBid> {
    return {
      event: OutBid,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      action: (_e) => {
        // Add message to Member message board.
      },
    };
  }
}
