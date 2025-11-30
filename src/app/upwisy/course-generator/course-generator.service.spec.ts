import { Test, TestingModule } from '@nestjs/testing';
import { CourseGeneratorService } from './course-generator.service';

describe('CourseGeneratorService', () => {
  let service: CourseGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGeneratorService],
    }).compile();

    service = module.get<CourseGeneratorService>(CourseGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
