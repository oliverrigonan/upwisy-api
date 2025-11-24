import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { DatabaseModule } from './../../database/database.module';
import { CoursesSchema } from 'src/database/schemas/courses.schema';

@Module({
  controllers: [
    CoursesController
  ],
  providers: [
    CoursesService,
    {
      provide: 'COURSES_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('courses', CoursesSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class CoursesModule { }
