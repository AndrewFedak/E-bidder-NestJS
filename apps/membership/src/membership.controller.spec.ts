import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from './membership.service';

describe('MembershipController', () => {
  let membershipController: MembershipController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [MembershipService],
    }).compile();

    membershipController = app.get<MembershipController>(MembershipController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(membershipController.getHello()).toBe('Hello World!');
    });
  });
});
