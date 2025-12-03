import { Module } from '@nestjs/common';

import { QuizItemsService } from './quiz-items.service';
import { QuizItemsController } from './quiz-items.controller';

import { DatabaseModule } from './../../database/database.module';
import { QuizItemsModelProvider } from './../../database/schemas/quiz-items.schema';

@Module({
  controllers: [
    QuizItemsController
  ],
  providers: [
    QuizItemsService,
    QuizItemsModelProvider
  ],
  imports: [DatabaseModule],
})
export class QuizItemsModule { }
