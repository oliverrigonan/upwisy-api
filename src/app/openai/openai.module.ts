import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { OpenaiController } from './openai.controller';

import { OpenaiService } from './openai.service';
import { LessonsService } from '../lessons/lessons.service';
import { LessonSectionsService } from '../lesson-sections/lesson-sections.service';
import { CoursesService } from '../courses/courses.service';

import { DatabaseModule } from './../../database/database.module';
import { LessonsModelProvider } from './../../database/schemas/lessons.schema';
import { LessonSectionsModelProvider } from './../../database/schemas/lesson-sections.schema';
import { CoursesModelProvider } from './../../database/schemas/courses.schema';

@Module({
  controllers: [
    OpenaiController
  ],
  providers: [
    OpenaiService,

    LessonsService,
    LessonSectionsService,
    CoursesService,

    LessonsModelProvider,
    LessonSectionsModelProvider,
    CoursesModelProvider,
  ],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    DatabaseModule,
  ]
})
export class OpenaiModule { }
