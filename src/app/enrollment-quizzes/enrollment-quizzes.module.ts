import { Module } from '@nestjs/common';

import { EnrollmentQuizzesService } from './enrollment-quizzes.service';
import { EnrollmentQuizzesController } from './enrollment-quizzes.controller';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentQuizzesModelProvider } from './../../database/schemas/enrollment-quizzes.schema';

@Module({
  controllers: [
    EnrollmentQuizzesController
  ],
  providers: [
    EnrollmentQuizzesService,
    EnrollmentQuizzesModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentQuizzesModule { }
