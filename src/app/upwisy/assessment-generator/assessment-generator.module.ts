import { Module } from '@nestjs/common';

import { AssessmentGeneratorService } from './assessment-generator.service';
import { AssessmentGeneratorGateway } from './assessment-generator.gateway';

import { UsersService } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
// import { AssessmentsService } from './../../assessments/assessments.service';
// import { AssessmentItemsService } from './../../assessment-items/assessment-items.service';

import { DatabaseModule } from './../../../database/database.module';
import { UsersModelProvider } from './../../../database/schemas/users.schema';
import { CoursesModelProvider } from './../../../database/schemas/courses.schema';
import { LessonsModelProvider } from './../../..//database/schemas/lessons.schema';
import { LessonSectionsModelProvider } from './../../..//database/schemas/lesson-sections.schema';
// import { AssessmentsModelProvider } from './../../../database/schemas/assessments.schema';
// import { AssessmentItemsModelProvider } from './../../../database/schemas/assessment-items.schema';

@Module({
  providers: [
    AssessmentGeneratorGateway,
    AssessmentGeneratorService,

    UsersService,
    CoursesService,
    LessonsService,
    LessonSectionsService,
    // AssessmentsService,
    // AssessmentItemsService,

    UsersModelProvider,
    CoursesModelProvider,
    LessonsModelProvider,
    LessonSectionsModelProvider,
    // AssessmentsModelProvider,
    // AssessmentItemsModelProvider,
  ],
  imports: [DatabaseModule],
})
export class AssessmentGeneratorModule { }
