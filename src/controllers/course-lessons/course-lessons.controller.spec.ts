import { Test, TestingModule } from '@nestjs/testing';
import { CourseLessonsController } from './course-lessons.controller';

describe('CourseLessonsController', () => {
  let controller: CourseLessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseLessonsController],
    }).compile();

    controller = module.get<CourseLessonsController>(CourseLessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
