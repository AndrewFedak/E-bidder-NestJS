import { Inject } from '@nestjs/common';

import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';

import { DYNAMODB_TOKEN } from './config/dynamodb/dynamodb.module';

import { Bid } from '@app/listings/src/domain/listing-format/auctions/bids/bid';
import { IBidHistoryRepository } from '@app/listings/src/domain/listing-format/auctions/bids/bid-history.repository';
import { BidDTO } from './data-model/bid.dto';

export class BidHistoryRepository implements IBidHistoryRepository {
  tableName = 'Bids';

  constructor(
    @Inject(DYNAMODB_TOKEN) private readonly _dynamoDB: DynamoDBClient,
  ) {}

  async numberOfBidsFor(auctionId: string): Promise<number> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: 'auctionIndex',
      KeyConditionExpression: 'AuctionId = :auctionId',
      ExpressionAttributeValues: {
        ':auctionId': { S: auctionId },
      },
      Select: 'COUNT',
    });
    const { Count } = await this._dynamoDB.send(command);

    return Count;
  }

  async add(bid: Bid): Promise<void> {
    const bidDto = new BidDTO(bid);
    const response = await this._dynamoDB.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: bidDto,
        ConditionExpression: 'attribute_not_exists(Id)',
      }),
    );

    if (response.$metadata.httpStatusCode !== 200) {
      throw new Error('Not created');
    }
  }
}
