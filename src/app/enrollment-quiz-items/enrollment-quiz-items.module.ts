import { Module } from '@nestjs/common';
import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { EnrollmentQuizItemsController } from './enrollment-quiz-items.controller';

@Module({
  controllers: [EnrollmentQuizItemsController],
  providers: [EnrollmentQuizItemsService],
})
export class EnrollmentQuizItemsModule {}
