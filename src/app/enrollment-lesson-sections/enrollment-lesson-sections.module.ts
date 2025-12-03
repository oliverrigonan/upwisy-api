import { Module } from '@nestjs/common';

import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { EnrollmentLessonSectionsController } from './enrollment-lesson-sections.controller';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentLessonSectionsModelProvider } from './../../database/schemas/enrollment-lesson-sections.schema';

@Module({
  controllers: [
    EnrollmentLessonSectionsController
  ],
  providers: [
    EnrollmentLessonSectionsService,
    EnrollmentLessonSectionsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentLessonSectionsModule { }
