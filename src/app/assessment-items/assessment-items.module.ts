import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { AssessmentItemsService } from './assessment-items.service';
import { AssessmentItemsController } from './assessment-items.controller';

import { DatabaseModule } from './../../database/database.module';
import { AssessmentItemsSchema } from 'src/database/schemas/assessment-items.schema';

@Module({
  controllers: [
    AssessmentItemsController
  ],
  providers: [
    AssessmentItemsService,
    {
      provide: 'ASSESSMENT_ITEMS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('assessment_items', AssessmentItemsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class AssessmentItemsModule { }
