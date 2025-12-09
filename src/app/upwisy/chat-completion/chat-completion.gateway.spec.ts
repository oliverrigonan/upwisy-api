import { Test, TestingModule } from '@nestjs/testing';
import { ChatCompletionGateway } from './chat-completion.gateway';

describe('ChatCompletionGateway', () => {
  let gateway: ChatCompletionGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatCompletionGateway],
    }).compile();

    gateway = module.get<ChatCompletionGateway>(ChatCompletionGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
