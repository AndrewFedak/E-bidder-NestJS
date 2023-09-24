import { Listing } from '@app/listings/src/domain/listings/listing';

import { Money } from '@app/listings/src/domain/money';

export class FixedPriceListing {
  constructor(
    public id: string,
    public sellerId: string,
    public buyNowPrice: Money,
    public endsAt: Date,
    public listing: Listing,
  ) {}

  bestOffer(): void {
    // http://ocsnext.ebay.co.uk/ocs/sc
    // for Buy It Now listing only
  }
}
