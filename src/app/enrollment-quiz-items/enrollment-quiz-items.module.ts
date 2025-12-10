import { Module } from '@nestjs/common';

import { EnrollmentQuizItemsController } from './enrollment-quiz-items.controller';

import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { EnrollmentQuizzesService } from '../enrollment-quizzes/enrollment-quizzes.service';
import { QuizItemsService } from '../quiz-items/quiz-items.service';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentQuizItemsModelProvider } from './../../database/schemas/enrollment-quiz-items.schema';
import { EnrollmentQuizzesModelProvider } from './../../database/schemas/enrollment-quizzes.schema';
import { QuizItemsModelProvider } from './../../database/schemas/quiz-items.schema';

@Module({
  controllers: [
    EnrollmentQuizItemsController
  ],
  providers: [
    EnrollmentQuizItemsService,
    EnrollmentQuizzesService,
    QuizItemsService,

    EnrollmentQuizItemsModelProvider,
    EnrollmentQuizzesModelProvider,
    QuizItemsModelProvider,
  ],
  imports: [DatabaseModule],
})
export class EnrollmentQuizItemsModule { }
