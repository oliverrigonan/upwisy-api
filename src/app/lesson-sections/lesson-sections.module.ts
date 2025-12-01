import { Module } from '@nestjs/common';

import { LessonSectionsService } from './lesson-sections.service';
import { LessonSectionsController } from './lesson-sections.controller';

import { DatabaseModule } from './../../database/database.module';
import { LessonSectionsModelProvider } from './../../database/schemas/lesson-sections.schema';

@Module({
  controllers: [
    LessonSectionsController
  ],
  providers: [
    LessonSectionsService,
    LessonSectionsModelProvider
  ],
  imports: [DatabaseModule],
})
export class LessonSectionsModule { }
