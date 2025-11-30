import { Test, TestingModule } from '@nestjs/testing';
import { CourseGeneratorGateway } from './course-generator.gateway';
import { CourseGeneratorService } from './course-generator.service';

describe('CourseGeneratorGateway', () => {
  let gateway: CourseGeneratorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGeneratorGateway, CourseGeneratorService],
    }).compile();

    gateway = module.get<CourseGeneratorGateway>(CourseGeneratorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
