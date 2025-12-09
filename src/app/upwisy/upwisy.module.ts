import { Module } from '@nestjs/common';

import { CourseGeneratorModule } from './course-generator/course-generator.module';
import { ChatCompletionModule } from './chat-completion/chat-completion.module';

import { UpwisyService } from './upwisy.service';
import { UsersService } from '../users/users.service';

import { DatabaseModule } from './../../database/database.module';
import { UsersModelProvider } from './../../database/schemas/users.schema';

@Module({
  imports: [
    CourseGeneratorModule,
    ChatCompletionModule,

    DatabaseModule,
  ],
  providers: [
    UpwisyService,
    UsersService,

    UsersModelProvider
  ],
})
export class UpwisyModule { }
