import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { LessonSectionsService } from './lesson-sections.service';
import { LessonSectionsController } from './lesson-sections.controller';

import { DatabaseModule } from './../../database/database.module';
import { LessonSectionsSchema } from './../../database/schemas/lesson-sections.schema';

@Module({
  controllers: [
    LessonSectionsController
  ],
  providers: [
    LessonSectionsService,
    {
      provide: 'LESSON_SECTIONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lesson_sections', LessonSectionsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class LessonSectionsModule { }
