import { Test, TestingModule } from '@nestjs/testing';
import { DisputesController } from './disputes.controller';
import { DisputesService } from './disputes.service';

describe('DisputesController', () => {
  let disputesController: DisputesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DisputesController],
      providers: [DisputesService],
    }).compile();

    disputesController = app.get<DisputesController>(DisputesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(disputesController.getHello()).toBe('Hello World!');
    });
  });
});
