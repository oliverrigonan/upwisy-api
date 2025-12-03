import { Module } from '@nestjs/common';
import { QuizItemsService } from './quiz-items.service';
import { QuizItemsController } from './quiz-items.controller';

@Module({
  controllers: [QuizItemsController],
  providers: [QuizItemsService],
})
export class QuizItemsModule {}
