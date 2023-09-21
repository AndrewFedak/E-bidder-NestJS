import { Test, TestingModule } from '@nestjs/testing';
import { SellerAccountController } from './seller-account.controller';
import { SellerAccountService } from './seller-account.service';

describe('SellerAccountController', () => {
  let sellerAccountController: SellerAccountController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SellerAccountController],
      providers: [SellerAccountService],
    }).compile();

    sellerAccountController = app.get<SellerAccountController>(
      SellerAccountController,
    );
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(sellerAccountController.getHello()).toBe('Hello World!');
    });
  });
});
