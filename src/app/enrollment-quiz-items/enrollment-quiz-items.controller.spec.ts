import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentQuizItemsController } from './enrollment-quiz-items.controller';
import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';

describe('EnrollmentQuizItemsController', () => {
  let controller: EnrollmentQuizItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentQuizItemsController],
      providers: [EnrollmentQuizItemsService],
    }).compile();

    controller = module.get<EnrollmentQuizItemsController>(EnrollmentQuizItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
