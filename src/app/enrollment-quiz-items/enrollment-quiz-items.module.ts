import { Module } from '@nestjs/common';

import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { EnrollmentQuizItemsController } from './enrollment-quiz-items.controller';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentQuizItemsModelProvider } from './../../database/schemas/enrollment-quiz-items.schema';

@Module({
  controllers: [
    EnrollmentQuizItemsController
  ],
  providers: [
    EnrollmentQuizItemsService,
    EnrollmentQuizItemsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentQuizItemsModule { }
