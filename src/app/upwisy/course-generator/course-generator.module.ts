import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { CourseGeneratorGateway } from './course-generator.gateway';
import { CourseGeneratorService } from './course-generator.service';

import { UsersService } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from 'src/app/lessons/lessons.service';
import { LessonSectionsService } from 'src/app/lesson-sections/lesson-sections.service';

import { DatabaseModule } from './../../../database/database.module';
import { UsersSchema } from 'src/database/schemas/users.schema';
import { CoursesSchema } from './../../../database/schemas/courses.schema';
import { LessonsSchema } from './../../..//database/schemas/lessons.schema';
import { LessonSectionsSchema } from './../../..//database/schemas/lesson-sections.schema';

@Module({
  providers: [
    CourseGeneratorGateway,
    CourseGeneratorService,

    UsersService,
    CoursesService,
    LessonsService,
    LessonSectionsService,

    {
      provide: 'USERS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('users', UsersSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'COURSES_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('courses', CoursesSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'LESSONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lessons', LessonsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'LESSON_SECTIONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lesson_sections', LessonSectionsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  imports: [DatabaseModule],
})
export class CourseGeneratorModule { }
