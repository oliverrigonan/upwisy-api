import { Module } from '@nestjs/common';

import { EnrollmentLessonsController } from './enrollment-lessons.controller';

import { EnrollmentLessonsService } from './enrollment-lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentLessonsModelProvider } from './../../database/schemas/enrollment-lessons.schema';
import { EnrollmentsModelProvider } from './../../database/schemas/enrollments.schema';

@Module({
  controllers: [
    EnrollmentLessonsController
  ],
  providers: [
    EnrollmentLessonsService,
    EnrollmentsService,

    EnrollmentLessonsModelProvider,
    EnrollmentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentLessonsModule { }
