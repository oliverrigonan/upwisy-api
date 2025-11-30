import { Test, TestingModule } from '@nestjs/testing';
import { UpwisyController } from './upwisy.controller';
import { UpwisyService } from './upwisy.service';

describe('UpwisyController', () => {
  let controller: UpwisyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UpwisyController],
      providers: [UpwisyService],
    }).compile();

    controller = module.get<UpwisyController>(UpwisyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
