import { Test, TestingModule } from '@nestjs/testing';
import { UpwisyService } from './upwisy.service';

describe('UpwisyService', () => {
  let service: UpwisyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpwisyService],
    }).compile();

    service = module.get<UpwisyService>(UpwisyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
