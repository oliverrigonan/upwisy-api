import { Module } from '@nestjs/common';
import { EnrollmentQuizzesService } from './enrollment-quizzes.service';
import { EnrollmentQuizzesController } from './enrollment-quizzes.controller';

@Module({
  controllers: [EnrollmentQuizzesController],
  providers: [EnrollmentQuizzesService],
})
export class EnrollmentQuizzesModule {}
