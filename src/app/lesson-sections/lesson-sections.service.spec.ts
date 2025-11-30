import { Test, TestingModule } from '@nestjs/testing';
import { LessonSectionsService } from './lesson-sections.service';

describe('LessonSectionsService', () => {
  let service: LessonSectionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LessonSectionsService],
    }).compile();

    service = module.get<LessonSectionsService>(LessonSectionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
