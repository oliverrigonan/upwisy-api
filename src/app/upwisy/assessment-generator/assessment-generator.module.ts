import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { AssessmentGeneratorService } from './assessment-generator.service';
import { AssessmentGeneratorGateway } from './assessment-generator.gateway';

import { UsersService } from './../../users/users.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
import { AssessmentsService } from './../../assessments/assessments.service';
import { AssessmentItemsService } from './../../assessment-items/assessment-items.service';

import { DatabaseModule } from './../../../database/database.module';
import { UsersSchema } from 'src/database/schemas/users.schema';
import { LessonsSchema } from './../../..//database/schemas/lessons.schema';
import { LessonSectionsSchema } from './../../..//database/schemas/lesson-sections.schema';
import { AssessmentsSchema } from 'src/database/schemas/assessments.schema';
import { AssessmentItemsSchema } from 'src/database/schemas/assessment-items.schema';

@Module({
  providers: [
    AssessmentGeneratorGateway,
    AssessmentGeneratorService,

    UsersService,
    LessonsService,
    LessonSectionsService,
    AssessmentsService,
    AssessmentItemsService,

    {
      provide: 'USERS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('users', UsersSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'LESSONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lessons', LessonsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'LESSON_SECTIONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lesson_sections', LessonSectionsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'ASSESSMENTS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('assessments', AssessmentsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
    {
      provide: 'ASSESSMENT_ITEMS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('assessment_items', AssessmentItemsSchema),
      inject: ['DATABASE_CONNECTION'],
    },
  ],
  imports: [DatabaseModule],
})
export class AssessmentGeneratorModule { }
