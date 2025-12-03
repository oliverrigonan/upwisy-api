import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentQuizzesService } from './enrollment-quizzes.service';

describe('EnrollmentQuizzesService', () => {
  let service: EnrollmentQuizzesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentQuizzesService],
    }).compile();

    service = module.get<EnrollmentQuizzesService>(EnrollmentQuizzesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
