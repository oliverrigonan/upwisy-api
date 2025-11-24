import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { LearningPlansService } from './learning-plans.service';
import { LearningPlansController } from './learning-plans.controller';

import { DatabaseModule } from './../../database/database.module';
import { LearningPlansSchema } from 'src/database/schemas/learning-plans.schema';

@Module({
  controllers: [
    LearningPlansController
  ],
  providers: [
    LearningPlansService,
    {
      provide: 'LEARNING_PLANS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('learning_plans', LearningPlansSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class LearningPlansModule { }
