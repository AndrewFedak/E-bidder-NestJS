import { Injectable } from '@nestjs/common';

@Injectable()
export class DisputesService {
  getHello(): string {
    return 'Hello World!';
  }
}
