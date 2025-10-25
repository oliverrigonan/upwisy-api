import { Test, TestingModule } from '@nestjs/testing';
import { CourseUsersController } from './course-users.controller';

describe('CourseUsersController', () => {
  let controller: CourseUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseUsersController],
    }).compile();

    controller = module.get<CourseUsersController>(CourseUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
