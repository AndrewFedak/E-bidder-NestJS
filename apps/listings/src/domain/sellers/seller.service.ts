import { Seller } from './seller';

export interface ISellerService {
  getSeller(sellerId: string): Seller;
}
