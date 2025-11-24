import { Test, TestingModule } from '@nestjs/testing';
import { LearningPlansController } from './learning-plans.controller';
import { LearningPlansService } from './learning-plans.service';

describe('LearningPlansController', () => {
  let controller: LearningPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LearningPlansController],
      providers: [LearningPlansService],
    }).compile();

    controller = module.get<LearningPlansController>(LearningPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
