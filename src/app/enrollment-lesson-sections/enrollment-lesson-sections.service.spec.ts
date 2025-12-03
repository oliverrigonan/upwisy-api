import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';

describe('EnrollmentLessonSectionsService', () => {
  let service: EnrollmentLessonSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentLessonSectionsService],
    }).compile();

    service = module.get<EnrollmentLessonSectionsService>(EnrollmentLessonSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
