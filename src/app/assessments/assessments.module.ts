import { Module } from '@nestjs/common';

import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';

import { DatabaseModule } from './../../database/database.module';
import { AssessmentsModelProvider } from './../../database/schemas/assessments.schema';

@Module({
  controllers: [
    AssessmentsController
  ],
  providers: [
    AssessmentsService,
    AssessmentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class AssessmentsModule { }
