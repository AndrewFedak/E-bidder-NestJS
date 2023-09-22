import { IsNotEmpty } from 'class-validator';

export class BidOnAuctionDto {
  @IsNotEmpty()
  amount: number;
}
