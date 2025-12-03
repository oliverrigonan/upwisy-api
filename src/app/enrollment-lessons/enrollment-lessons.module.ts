import { Module } from '@nestjs/common';
import { EnrollmentLessonsService } from './enrollment-lessons.service';
import { EnrollmentLessonsController } from './enrollment-lessons.controller';

@Module({
  controllers: [EnrollmentLessonsController],
  providers: [EnrollmentLessonsService],
})
export class EnrollmentLessonsModule {}
