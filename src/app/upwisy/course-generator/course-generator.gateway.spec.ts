import { Test, TestingModule } from '@nestjs/testing';
import { CourseGeneratorGateway } from './course-generator.gateway';

describe('CourseGeneratorGateway', () => {
  let gateway: CourseGeneratorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseGeneratorGateway],
    }).compile();

    gateway = module.get<CourseGeneratorGateway>(CourseGeneratorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
