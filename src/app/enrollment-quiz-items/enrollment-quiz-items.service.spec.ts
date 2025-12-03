import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';

describe('EnrollmentQuizItemsService', () => {
  let service: EnrollmentQuizItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentQuizItemsService],
    }).compile();

    service = module.get<EnrollmentQuizItemsService>(EnrollmentQuizItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
