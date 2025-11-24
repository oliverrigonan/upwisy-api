import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { CourseSessionsService } from './course-sessions.service';
import { CourseSessionsController } from './course-sessions.controller';

import { DatabaseModule } from './../../database/database.module';
import { CourseSessionsSchema } from 'src/database/schemas/course-sessions.schema';

@Module({
  controllers: [
    CourseSessionsController
  ],
  providers: [
    CourseSessionsService,
    {
      provide: 'COURSE_SESSIONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('course_sessions', CourseSessionsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class CourseSessionsModule { }
