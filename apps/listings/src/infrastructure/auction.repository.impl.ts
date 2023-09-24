import { ClassProvider, Inject } from '@nestjs/common';
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb';

import {
  IAuctionRepository,
  AUCTION_REPOSITORY_TOKEN,
} from '../domain/listing-format/auctions/auction/auction.repository';

import { DYNAMODB_TOKEN } from './config/dynamodb/dynamodb.module';

import { Auction } from '@app/listings/src/domain/listing-format/auctions/auction/auction';
import { AuctionDTO } from './data-model/auction.dto';
import { AuctionSnapshot } from '../domain/listing-format/auctions/auction/auction-snapshot';
import { WinningBidSnapshot } from '../domain/listing-format/auctions/winning-bid/winning-bid-snapshot';

class AuctionRepositoryImplementation implements IAuctionRepository {
  private tableName = 'Auctions';
  constructor(
    @Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: DynamoDBClient,
  ) {}

  async add(auction: Auction): Promise<void> {
    const snapshot = auction.getSnapshot();
    const auctionDto = new AuctionDTO(snapshot);
    const response = await this._dynamoDB.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: auctionDto,
        ConditionExpression: 'attribute_not_exists(Id)',
      }),
    );

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error('Not created');
    }
  }

  async findBy(id: string): Promise<Auction> {
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: 'Id = :id',
      ExpressionAttributeValues: {
        ':id': { S: id },
      },
    });
    const { Items } = await this._dynamoDB.send(command);
    const auction = Items[0] as AuctionDTO;

    const auctionSnapshot = new AuctionSnapshot();
    auctionSnapshot.id = auction.Id.S;
    auctionSnapshot.listingId = auction.ListingId.S;
    auctionSnapshot.startingPrice = +auction.StartingPrice.S;
    auctionSnapshot.endsAt = new Date(auction.AuctionEnds.S);
    auctionSnapshot.version = +auction.Version.S;

    if (auction.BidderMemberId) {
      const bidSnapshot = new WinningBidSnapshot();
      bidSnapshot.auctionId = auction.Id.S;
      bidSnapshot.biddersMaximumBid = +auction.MaximumBid.N;
      bidSnapshot.currentPrice = +auction.CurrentPrice.N;
      bidSnapshot.bidderId = auction.BidderMemberId.S;
      bidSnapshot.timeOfBid = new Date(auction.TimeOfBid.S);
      auctionSnapshot.winningBid = bidSnapshot;
    }

    return new Auction(auctionSnapshot);
  }
}

export const AuctionRepository: ClassProvider<AuctionRepositoryImplementation> =
  {
    provide: AUCTION_REPOSITORY_TOKEN,
    useClass: AuctionRepositoryImplementation,
  };
