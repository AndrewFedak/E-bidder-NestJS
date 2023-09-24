import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { AuctionSnapshot } from '../../domain/listing-format/auctions/auction/auction-snapshot';

export class AuctionDTO {
  [x: string]: AttributeValue; // hack to resolve Typescript and AWS DynamoDB Item Record<string, AttributeValue> issue

  Id: AttributeValue.SMember;
  ListingId: AttributeValue.SMember;
  StartingPrice: AttributeValue.NMember;
  AuctionEnds: AttributeValue.SMember;
  Version: AttributeValue.NMember;
  BidderMemberId: AttributeValue.SMember;
  CurrentPrice: AttributeValue.NMember;
  MaximumBid: AttributeValue.NMember;
  TimeOfBid: AttributeValue.SMember;

  constructor({
    id,
    listingId,
    startingPrice,
    endsAt,
    winningBid,
    version,
  }: AuctionSnapshot) {
    this.Id = { S: id };
    this.ListingId = { S: listingId };
    this.StartingPrice = { N: `${startingPrice}` };
    this.AuctionEnds = { S: endsAt.toString() };
    this.Version = { N: `${version}` };
    this.BidderMemberId = { S: winningBid.bidderId };
    this.CurrentPrice = { N: `${winningBid.currentPrice}` };
    this.MaximumBid = { N: `${winningBid.biddersMaximumBid}` };
    this.TimeOfBid = { S: winningBid.timeOfBid.toString() };
  }
}
