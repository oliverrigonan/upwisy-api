import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { CourseLessonsService } from './course-lessons.service';
import { CourseLessonsController } from './course-lessons.controller';

import { DatabaseModule } from './../../database/database.module';
import { CourseLessonsSchema } from 'src/database/schemas/course-lessons.schema';

@Module({
  controllers: [
    CourseLessonsController
  ],
  providers: [
    CourseLessonsService,
    {
      provide: 'COURSE_LESSONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('course_lessons', CourseLessonsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class CourseLessonsModule { }
