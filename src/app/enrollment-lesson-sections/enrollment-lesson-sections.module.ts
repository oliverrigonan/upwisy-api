import { Module } from '@nestjs/common';

import { EnrollmentLessonSectionsController } from './enrollment-lesson-sections.controller';

import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { EnrollmentLessonsService } from '../enrollment-lessons/enrollment-lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentLessonSectionsModelProvider } from './../../database/schemas/enrollment-lesson-sections.schema';
import { EnrollmentLessonsModelProvider } from './../../database/schemas/enrollment-lessons.schema';
import { EnrollmentsModelProvider } from './../../database/schemas/enrollments.schema';

@Module({
  controllers: [
    EnrollmentLessonSectionsController
  ],
  providers: [
    EnrollmentLessonSectionsService,
    EnrollmentLessonsService,
    EnrollmentsService,

    EnrollmentLessonSectionsModelProvider,
    EnrollmentLessonsModelProvider,
    EnrollmentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentLessonSectionsModule { }
