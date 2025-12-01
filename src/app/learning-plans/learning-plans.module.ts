import { Module } from '@nestjs/common';

import { LearningPlansService } from './learning-plans.service';
import { LearningPlansController } from './learning-plans.controller';

import { DatabaseModule } from './../../database/database.module';
import { LearningPlansModelProvider } from './../../database/schemas/learning-plans.schema';

@Module({
  controllers: [
    LearningPlansController
  ],
  providers: [
    LearningPlansService,
    LearningPlansModelProvider
  ],
  imports: [DatabaseModule],
})
export class LearningPlansModule { }
