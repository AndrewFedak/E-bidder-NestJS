import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { Bid } from '../../domain/listing-format/auctions/bids/bid';

export class BidDTO {
  [x: string]: AttributeValue; // hack to resolve Typescript and AWS DynamoDB Item Record<string, AttributeValue> issue

  Id: AttributeValue.SMember;
  AuctionId: AttributeValue.SMember;
  BidderId: AttributeValue.SMember;
  AmountBid: AttributeValue.NMember;
  TimeOfBid: AttributeValue.SMember;

  constructor(bid: Bid) {
    this.Id = { S: bid.id };
    this.AuctionId = { S: bid.auctionId };
    this.BidderId = { S: bid.bidderId };
    this.AmountBid = { N: `${bid.amountBid}` };
    this.TimeOfBid = { S: bid.timeOfBid.toString() };
  }
}
