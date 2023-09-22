import { IsNotEmpty } from 'class-validator';

export class CreateAuctionDto {
  @IsNotEmpty()
  startingPrice: number;

  @IsNotEmpty()
  sellerId: string;

  @IsNotEmpty()
  endsAt: Date;
}
