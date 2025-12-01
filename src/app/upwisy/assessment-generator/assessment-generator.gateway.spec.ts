import { Test, TestingModule } from '@nestjs/testing';
import { AssessmentGeneratorGateway } from './assessment-generator.gateway';
import { AssessmentGeneratorService } from './assessment-generator.service';

describe('AssessmentGeneratorGateway', () => {
  let gateway: AssessmentGeneratorGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AssessmentGeneratorGateway, AssessmentGeneratorService],
    }).compile();

    gateway = module.get<AssessmentGeneratorGateway>(AssessmentGeneratorGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
