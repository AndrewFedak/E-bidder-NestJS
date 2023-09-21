import { Controller, Get } from '@nestjs/common';
import { SellerAccountService } from './seller-account.service';

@Controller()
export class SellerAccountController {
  constructor(private readonly sellerAccountService: SellerAccountService) {}

  @Get()
  getHello(): string {
    return this.sellerAccountService.getHello();
  }
}
