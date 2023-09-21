import { Injectable } from '@nestjs/common';

@Injectable()
export class SellerAccountService {
  getHello(): string {
    return 'Hello World!';
  }
}
