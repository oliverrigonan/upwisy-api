import { Injectable } from '@nestjs/common';
import { CreateQuizItemDto } from './dto/create-quiz-item.dto';
import { UpdateQuizItemDto } from './dto/update-quiz-item.dto';

@Injectable()
export class QuizItemsService {
  create(createQuizItemDto: CreateQuizItemDto) {
    return 'This action adds a new quizItem';
  }

  findAll() {
    return `This action returns all quizItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} quizItem`;
  }

  update(id: number, updateQuizItemDto: UpdateQuizItemDto) {
    return `This action updates a #${id} quizItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} quizItem`;
  }
}
