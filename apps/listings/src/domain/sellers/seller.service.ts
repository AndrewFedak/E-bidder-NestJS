import { Seller } from './seller';

interface ISellerService {
  getSeller(sellerId: string): Seller;
}

export class SellerService implements ISellerService {
  getSeller(sellerId: string): Seller {
    throw new Error('Method not implemented.');
  }
}
