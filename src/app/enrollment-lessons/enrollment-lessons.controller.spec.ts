import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentLessonsController } from './enrollment-lessons.controller';
import { EnrollmentLessonsService } from './enrollment-lessons.service';

describe('EnrollmentLessonsController', () => {
  let controller: EnrollmentLessonsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentLessonsController],
      providers: [EnrollmentLessonsService],
    }).compile();

    controller = module.get<EnrollmentLessonsController>(EnrollmentLessonsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
