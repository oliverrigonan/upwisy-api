import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { AssessmentsService } from './assessments.service';
import { AssessmentsController } from './assessments.controller';

import { DatabaseModule } from './../../database/database.module';
import { AssessmentsSchema } from 'src/database/schemas/assessments.schema';

@Module({
  controllers: [
    AssessmentsController
  ],
  providers: [
    AssessmentsService,
    {
      provide: 'ASSESSMENTS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('assessments', AssessmentsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class AssessmentsModule { }
