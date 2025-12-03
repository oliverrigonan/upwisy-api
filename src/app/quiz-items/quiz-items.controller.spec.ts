import { Test, TestingModule } from '@nestjs/testing';
import { QuizItemsController } from './quiz-items.controller';
import { QuizItemsService } from './quiz-items.service';

describe('QuizItemsController', () => {
  let controller: QuizItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizItemsController],
      providers: [QuizItemsService],
    }).compile();

    controller = module.get<QuizItemsController>(QuizItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
