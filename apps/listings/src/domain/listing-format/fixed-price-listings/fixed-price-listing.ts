import { Listing } from '../../listings/listing';
import { Money } from '../../money';

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
