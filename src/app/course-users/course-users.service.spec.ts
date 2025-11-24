import { Test, TestingModule } from '@nestjs/testing';
import { CourseUsersService } from './course-users.service';

describe('CourseUsersService', () => {
  let service: CourseUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseUsersService],
    }).compile();

    service = module.get<CourseUsersService>(CourseUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
