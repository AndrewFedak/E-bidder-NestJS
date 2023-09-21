import { Module } from '@nestjs/common';
import { SellerAccountController } from './seller-account.controller';
import { SellerAccountService } from './seller-account.service';

@Module({
  imports: [],
  controllers: [SellerAccountController],
  providers: [SellerAccountService],
})
export class SellerAccountModule {}
