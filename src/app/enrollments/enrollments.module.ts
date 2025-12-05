import { Module } from '@nestjs/common';

import { EnrollmentsController } from './enrollments.controller';

import { EnrollmentsService } from './enrollments.service';
import { EnrollmentLessonsService } from './../enrollment-lessons/enrollment-lessons.service';
import { EnrollmentLessonSectionsService } from './..//enrollment-lesson-sections/enrollment-lesson-sections.service';
import { EnrollmentQuizzesService } from './..//enrollment-quizzes/enrollment-quizzes.service';
import { EnrollmentQuizItemsService } from './.././enrollment-quiz-items/enrollment-quiz-items.service';
import { CoursesService } from './../courses/courses.service';
import { LessonsService } from './../lessons/lessons.service';
import { LessonSectionsService } from './../lesson-sections/lesson-sections.service';
import { QuizzesService } from './../quizzes/quizzes.service';
import { QuizItemsService } from './../quiz-items/quiz-items.service';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentsModelProvider } from './../../database/schemas/enrollments.schema';
import { EnrollmentLessonsModelProvider } from './../../database/schemas/enrollment-lessons.schema';
import { EnrollmentLessonSectionsModelProvider } from './../../database/schemas/enrollment-lesson-sections.schema';
import { EnrollmentQuizzesModelProvider } from './../../database/schemas/enrollment-quizzes.schema';
import { EnrollmentQuizItemsModelProvider } from './../../database/schemas/enrollment-quiz-items.schema';
import { CoursesModelProvider } from './../../database/schemas/courses.schema';
import { LessonsModelProvider } from './../../database/schemas/lessons.schema';
import { LessonSectionsModelProvider } from './../../database/schemas/lesson-sections.schema';
import { QuizzesModelProvider } from './../../database/schemas/quizzes.schema';
import { QuizItemsModelProvider } from './../../database/schemas/quiz-items.schema';

@Module({
  controllers: [
    EnrollmentsController
  ],
  providers: [
    EnrollmentsService,
    EnrollmentLessonsService,
    EnrollmentLessonSectionsService,
    EnrollmentQuizzesService,
    EnrollmentQuizItemsService,
    CoursesService,
    LessonsService,
    LessonSectionsService,
    QuizzesService,
    QuizItemsService,

    EnrollmentsModelProvider,
    EnrollmentLessonsModelProvider,
    EnrollmentLessonSectionsModelProvider,
    EnrollmentQuizzesModelProvider,
    EnrollmentQuizItemsModelProvider,
    CoursesModelProvider,
    LessonsModelProvider,
    LessonSectionsModelProvider,
    QuizzesModelProvider,
    QuizItemsModelProvider,
  ],
  imports: [DatabaseModule],
})
export class EnrollmentsModule { }
