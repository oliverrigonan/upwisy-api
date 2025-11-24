import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentItemsController } from './assessment-items.controller';
import { AssessmentItemsService } from './assessment-items.service';

describe('AssessmentItemsController', () => {
  let controller: AssessmentItemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssessmentItemsController],
      providers: [AssessmentItemsService],
    }).compile();

    controller = module.get<AssessmentItemsController>(AssessmentItemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
