import { Module } from '@nestjs/common';

import { EnrollmentLessonsService } from './enrollment-lessons.service';
import { EnrollmentLessonsController } from './enrollment-lessons.controller';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentLessonsModelProvider } from './../../database/schemas/enrollment-lessons.schema';

@Module({
  controllers: [
    EnrollmentLessonsController
  ],
  providers: [
    EnrollmentLessonsService,
    EnrollmentLessonsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentLessonsModule { }
