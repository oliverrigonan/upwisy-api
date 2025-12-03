import { Test, TestingModule } from '@nestjs/testing';
import { QuizItemsService } from './quiz-items.service';

describe('QuizItemsService', () => {
  let service: QuizItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuizItemsService],
    }).compile();

    service = module.get<QuizItemsService>(QuizItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
