import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";

import { UpwisyService } from '../upwisy.service';
import { ChatMessages, CreateChatCompletionDto } from './dto/create-chat-completion.dto';

@UseGuards(AuthGuard)
@WebSocketGateway(81, {
  namespace: '/upwisy/chat-completion',
  transports: ['polling', 'websocket'],
  cors: {
    origin: '*',
  },
})
export class ChatCompletionGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly upwisyService: UpwisyService,
  ) { }

  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  performDataValidation(socket: Socket, data: CreateChatCompletionDto): void {
    if (!data || typeof data !== 'object') {
      socket.emit('error', 'Invalid data received.');
    }

    if (!this.upwisyService.matchesClassShape(data, CreateChatCompletionDto)) {
      socket.emit('error', `Invalid ${CreateChatCompletionDto.name} structure.`);
    }
  }

  private async generateChatCompletion(messages: ChatMessages[]) {
    const stream = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: messages.map(msg => ({ role: msg.role as 'system' | 'user' | 'assistant', content: msg.content })),
      stream: true,
    });

    return stream;
  }

  @SubscribeMessage('create-chat-completion')
  async handleChatCompletionCreation(
    @MessageBody() data: CreateChatCompletionDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    const currentUser = await this.upwisyService.getCurrentUser(socket);
    if (!currentUser) return;

    this.performDataValidation(socket, data);

    try {
      const stream = await this.generateChatCompletion(data.messages);
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          socket.emit('chat-completion-response', content);
        }
      }
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }
}
