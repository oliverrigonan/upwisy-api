import { Module } from '@nestjs/common';

import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

import { DatabaseModule } from './../../database/database.module';
import { SessionsModelProvider } from './../../database/schemas/sessions.schema';

@Module({
  controllers: [
    SessionsController
  ],
  providers: [
    SessionsService,
    SessionsModelProvider
  ],
  imports: [DatabaseModule],
})
export class SessionsModule { }
