import { Module } from '@nestjs/common';

import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';

import { DatabaseModule } from './../../database/database.module';
import { CoursesModelProvider } from './../../database/schemas/courses.schema';

@Module({
  controllers: [
    CoursesController
  ],
  providers: [
    CoursesService,
    CoursesModelProvider
  ],
  imports: [DatabaseModule],
})
export class CoursesModule { }
