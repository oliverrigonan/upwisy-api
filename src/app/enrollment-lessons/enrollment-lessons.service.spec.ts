import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentLessonsService } from './enrollment-lessons.service';

describe('EnrollmentLessonsService', () => {
  let service: EnrollmentLessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentLessonsService],
    }).compile();

    service = module.get<EnrollmentLessonsService>(EnrollmentLessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
