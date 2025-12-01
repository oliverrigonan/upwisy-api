import { Module } from '@nestjs/common';

import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';

import { DatabaseModule } from './../../database/database.module';
import { LessonsModelProvider } from './../../database/schemas/lessons.schema';

@Module({
  controllers: [
    LessonsController
  ],
  providers: [
    LessonsService,
    LessonsModelProvider
  ],
  imports: [DatabaseModule],
})
export class LessonsModule { }
