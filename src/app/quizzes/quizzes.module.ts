import { Module } from '@nestjs/common';

import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';

import { DatabaseModule } from './../../database/database.module';
import { QuizzesModelProvider } from './../../database/schemas/quizzes.schema';

@Module({
  controllers: [
    QuizzesController
  ],
  providers: [
    QuizzesService,
    QuizzesModelProvider
  ],
  imports: [DatabaseModule],
})
export class QuizzesModule { }
