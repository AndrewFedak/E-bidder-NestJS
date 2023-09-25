import { Injectable } from '@nestjs/common';

@Injectable()
export class Clock {
  time(): Date {
    return new Date();
  }
}
