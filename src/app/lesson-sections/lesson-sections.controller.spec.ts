import { Test, TestingModule } from '@nestjs/testing';
import { LessonSectionsController } from './lesson-sections.controller';
import { LessonSectionsService } from './lesson-sections.service';

describe('LessonSectionsController', () => {
  let controller: LessonSectionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonSectionsController],
      providers: [LessonSectionsService],
    }).compile();

    controller = module.get<LessonSectionsController>(LessonSectionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
