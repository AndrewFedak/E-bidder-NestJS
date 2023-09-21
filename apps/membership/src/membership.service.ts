import { Injectable } from '@nestjs/common';

@Injectable()
export class MembershipService {
  getHello(): string {
    return 'Hello World!';
  }
}
