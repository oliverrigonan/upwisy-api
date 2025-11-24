import { Test, TestingModule } from '@nestjs/testing';
import { CourseLessonsService } from './course-lessons.service';

describe('CourseLessonsService', () => {
  let service: CourseLessonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseLessonsService],
    }).compile();

    service = module.get<CourseLessonsService>(CourseLessonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
