import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemsService } from './assessment-items.service';

describe('AssessmentItemsService', () => {
  let service: AssessmentItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentItemsService],
    }).compile();

    service = module.get<AssessmentItemsService>(AssessmentItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
