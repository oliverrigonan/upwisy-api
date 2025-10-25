import { Test, TestingModule } from '@nestjs/testing';
import { LearningPlansController } from './learning-plans.controller';

describe('LearningPlansController', () => {
  let controller: LearningPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningPlansController],
    }).compile();

    controller = module.get<LearningPlansController>(LearningPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
