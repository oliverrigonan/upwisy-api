import { Test, TestingModule } from '@nestjs/testing';
import { LearningPlansService } from './learning-plans.service';

describe('LearningPlansService', () => {
  let service: LearningPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LearningPlansService],
    }).compile();

    service = module.get<LearningPlansService>(LearningPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
