import { Module } from '@nestjs/common';

import { AssessmentItemsService } from './assessment-items.service';
import { AssessmentItemsController } from './assessment-items.controller';

import { DatabaseModule } from './../../database/database.module';
import { AssessmentItemsModelProvider } from './../../database/schemas/assessment-items.schema';

@Module({
  controllers: [
    AssessmentItemsController
  ],
  providers: [
    AssessmentItemsService,
    AssessmentItemsModelProvider
  ],
  imports: [DatabaseModule],
})
export class AssessmentItemsModule { }
