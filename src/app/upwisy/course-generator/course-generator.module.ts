import { Module } from '@nestjs/common';

import { CourseGeneratorGateway } from './course-generator.gateway';

import { UsersService } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
import { QuizzesService } from './../../quizzes/quizzes.service';
import { QuizItemsService } from './../../quiz-items/quiz-items.service';
import { FileContentsService } from './../../file-contents/file-contents.service';

import { DatabaseModule } from './../../../database/database.module';
import { UsersModelProvider } from './../../../database/schemas/users.schema';
import { CoursesModelProvider } from './../../../database/schemas/courses.schema';
import { LessonsModelProvider } from './../../..//database/schemas/lessons.schema';
import { LessonSectionsModelProvider } from './../../../database/schemas/lesson-sections.schema';
import { QuizzesModelProvider } from './../../../database/schemas/quizzes.schema';
import { QuizItemsModelProvider } from './../../../database/schemas/quiz-items.schema';
import { FileContentsModelProvider } from './../../../database/schemas/file-contents.schema';

@Module({
  providers: [
    CourseGeneratorGateway,

    UsersService,
    CoursesService,
    LessonsService,
    LessonSectionsService,
    QuizzesService,
    QuizItemsService,
    FileContentsService,

    UsersModelProvider,
    CoursesModelProvider,
    LessonsModelProvider,
    LessonSectionsModelProvider,
    QuizzesModelProvider,
    QuizItemsModelProvider,
    FileContentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class CourseGeneratorModule { }
