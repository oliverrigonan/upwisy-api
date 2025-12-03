import { Module } from '@nestjs/common';

import { EnrollmentsService } from './enrollments.service';
import { EnrollmentsController } from './enrollments.controller';

import { DatabaseModule } from './../../database/database.module';
import { EnrollmentsModelProvider } from './../../database/schemas/enrollments.schema';

@Module({
  controllers: [
    EnrollmentsController
  ],
  providers: [
    EnrollmentsService,
    EnrollmentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class EnrollmentsModule { }
