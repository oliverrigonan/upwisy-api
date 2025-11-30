import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

import { DatabaseModule } from './../../database/database.module';
import { LessonsSchema } from './../../database/schemas/lessons.schema';

@Module({
  controllers: [
    LessonsController
  ],
  providers: [
    LessonsService,
    {
      provide: 'LESSONS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('lessons', LessonsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class LessonsModule { }
