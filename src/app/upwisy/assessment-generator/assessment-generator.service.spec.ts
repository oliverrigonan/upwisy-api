import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentGeneratorService } from './assessment-generator.service';

describe('AssessmentGeneratorService', () => {
  let service: AssessmentGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentGeneratorService],
    }).compile();

    service = module.get<AssessmentGeneratorService>(AssessmentGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
