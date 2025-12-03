import { Module } from '@nestjs/common';
import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { EnrollmentLessonSectionsController } from './enrollment-lesson-sections.controller';

@Module({
  controllers: [EnrollmentLessonSectionsController],
  providers: [EnrollmentLessonSectionsService],
})
export class EnrollmentLessonSectionsModule {}
