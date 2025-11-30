import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';

import { DatabaseModule } from './../../database/database.module';
import { SessionsSchema } from 'src/database/schemas/sessions.schema';

@Module({
  controllers: [
    SessionsController
  ],
  providers: [
    SessionsService,
    {
      provide: 'SESSIONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('sessions', SessionsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class SessionsModule { }
