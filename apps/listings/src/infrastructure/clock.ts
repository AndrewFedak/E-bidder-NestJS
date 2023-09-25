import { Injectable } from '@nestjs/common';

/* Time is an important concept in the auction domain, and bids should only be able to be placed
while the auction is still active. As always, you never want to tie your domain objects to the
system clock because it makes testing difficult. So with this in mind, you will abstract the concept
of a clock by defining an interface named IClock within the Infrastructure folder */

@Injectable()
export class Clock {
  time(): Date {
    return new Date();
  }
}
