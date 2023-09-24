import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { CreateAuctionService } from './create-auction/create-auction.service';
import { BidOnAuctionService } from './bid-on-auction/bid-on-auction.service';
import { QueryAuctionStatus } from './query-auction-status/query-auction-status.service';
import { QueryBidHistory } from './query-bid-history/query-bid-history.service';

import { CreateAuctionDto } from './create-auction/auction-creation.dto';
import { BidOnAuctionDto } from './bid-on-auction/bid-on-auction.dto';

@Controller('/auctions')
export class AuctionController {
  constructor(
    private readonly _createAuctionService: CreateAuctionService,
    private readonly _bidOnAuctionService: BidOnAuctionService,
    private readonly _queryAuctionStatusService: QueryAuctionStatus,
    private readonly _queryBidHistory: QueryBidHistory,
  ) {}

  @Post('/create')
  @UsePipes(new ValidationPipe({ transform: true }))
  createAuction(@Body() createAuctionDto: CreateAuctionDto) {
    return this._createAuctionService.create(createAuctionDto);
  }

  @Post('/:id/bid')
  @UsePipes(new ValidationPipe({ transform: true }))
  bidOnAuction(
    @Req() req,
    @Param('id') auctionId: string,
    @Body() bidOnAuctionDto: BidOnAuctionDto,
  ) {
    return this._bidOnAuctionService.bid(
      auctionId,
      req.user.id, //to be implemented
      bidOnAuctionDto.amount,
    );
  }

  @Get('/:id/status')
  getAuctionStatus(@Param('id') auctionId: string) {
    return this._queryAuctionStatusService.auctionStatus(auctionId);
  }

  @Get('/:id/bid-history')
  getBidHistoryFor(@Param('id') auctionId: string) {
    return this._queryBidHistory.bidHistoryFor(auctionId);
  }
}
