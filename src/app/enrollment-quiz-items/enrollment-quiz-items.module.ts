import { Module } from '@nestjs/common';

import { EnrollmentQuizItemsController } from './enrollment-quiz-items.controller';

import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { EnrollmentQuizzesService } from '../enrollment-quizzes/enrollment-quizzes.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { QuizItemsService } from '../quiz-items/quiz-items.service';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentQuizItemsModelProvider } from './../../database/schemas/enrollment-quiz-items.schema';
import { EnrollmentQuizzesModelProvider } from './../../database/schemas/enrollment-quizzes.schema';
import { EnrollmentsModelProvider } from './../../database/schemas/enrollments.schema';
import { QuizItemsModelProvider } from './../../database/schemas/quiz-items.schema';

@Module({
  controllers: [
    EnrollmentQuizItemsController
  ],
  providers: [
    EnrollmentQuizItemsService,
    EnrollmentQuizzesService,
    EnrollmentsService,
    QuizItemsService,

    EnrollmentQuizItemsModelProvider,
    EnrollmentQuizzesModelProvider,
    EnrollmentsModelProvider,
    QuizItemsModelProvider,
  ],
  imports: [DatabaseModule],
})
export class EnrollmentQuizItemsModule { }
