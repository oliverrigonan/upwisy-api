import { Test, TestingModule } from '@nestjs/testing';
import { FileContentsController } from './file-contents.controller';
import { FileContentsService } from './file-contents.service';

describe('FileContentsController', () => {
  let controller: FileContentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileContentsController],
      providers: [FileContentsService],
    }).compile();

    controller = module.get<FileContentsController>(FileContentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
