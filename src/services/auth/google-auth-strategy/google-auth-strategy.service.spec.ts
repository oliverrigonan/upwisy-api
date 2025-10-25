import { Test, TestingModule } from '@nestjs/testing';
import { GoogleAuthStrategyService } from './google-auth-strategy.service';

describe('GoogleAuthStrategyService', () => {
  let service: GoogleAuthStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoogleAuthStrategyService],
    }).compile();

    service = module.get<GoogleAuthStrategyService>(GoogleAuthStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
