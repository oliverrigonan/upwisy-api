import { Module } from '@nestjs/common';

import { ChatCompletionGateway } from './chat-completion.gateway';

import { UpwisyService } from '../upwisy.service';
import { UsersService } from './../../users/users.service';

import { DatabaseModule } from './../../../database/database.module';
import { UsersModelProvider } from './../../../database/schemas/users.schema';

@Module({
  providers: [
    ChatCompletionGateway,
    
    UpwisyService,
    UsersService,

    UsersModelProvider,
  ],
  imports: [DatabaseModule],
})
export class ChatCompletionModule { }
