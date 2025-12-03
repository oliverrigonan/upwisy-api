import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentQuizzesController } from './enrollment-quizzes.controller';
import { EnrollmentQuizzesService } from './enrollment-quizzes.service';

describe('EnrollmentQuizzesController', () => {
  let controller: EnrollmentQuizzesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentQuizzesController],
      providers: [EnrollmentQuizzesService],
    }).compile();

    controller = module.get<EnrollmentQuizzesController>(EnrollmentQuizzesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
