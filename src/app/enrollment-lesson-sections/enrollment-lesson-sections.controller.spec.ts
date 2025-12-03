import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentLessonSectionsController } from './enrollment-lesson-sections.controller';
import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';

describe('EnrollmentLessonSectionsController', () => {
  let controller: EnrollmentLessonSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentLessonSectionsController],
      providers: [EnrollmentLessonSectionsService],
    }).compile();

    controller = module.get<EnrollmentLessonSectionsController>(EnrollmentLessonSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
