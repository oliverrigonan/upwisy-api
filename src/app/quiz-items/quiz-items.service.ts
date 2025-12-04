import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { QuizItem } from './entities/quiz-item.entity';

import { CreateQuizItemDto } from './dto/create-quiz-item.dto';
import { UpdateQuizItemDto } from './dto/update-quiz-item.dto';

export type QuizItemDocument = HydratedDocument<QuizItem>;

@Injectable()
export class QuizItemsService {

  constructor(
    @Inject('QUIZ_ITEMS_MODEL')
    private quizItemsModel: Model<QuizItemDocument>,
  ) { }

  async create(createQuizItemDto: CreateQuizItemDto) {
    const newQuizItem: QuizItem = {
      quiz_id: createQuizItemDto.quiz_id,
      type: createQuizItemDto.type,
      question: createQuizItemDto.question,
      options: createQuizItemDto.options,
      correct_answer: createQuizItemDto.correct_answer,
      answer_explanation: createQuizItemDto.answer_explanation,
    };

    const createdQuizItem = new this.quizItemsModel(newQuizItem);
    return await createdQuizItem.save();
  }

  async createMany(createQuizItemDtos: CreateQuizItemDto[]) {
    const newQuizItems: QuizItem[] = createQuizItemDtos.map(createQuizItemDto => ({
      quiz_id: createQuizItemDto.quiz_id,
      type: createQuizItemDto.type,
      question: createQuizItemDto.question,
      options: createQuizItemDto.options,
      correct_answer: createQuizItemDto.correct_answer,
      answer_explanation: createQuizItemDto.answer_explanation,
    }));

    const createdQuizItems = await this.quizItemsModel.insertMany(newQuizItems);
    return createdQuizItems;
  }

  async findAll() {
    return await this.quizItemsModel.find().exec();
  }

  async findByQuizId(quiz_id: string) {
    return await this.quizItemsModel.find({
      quiz_id: quiz_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.quizItemsModel.findById(id).exec();
  }

  update(id: string, updateQuizItemDto: UpdateQuizItemDto) {
    const updatedQuizItem: Partial<QuizItem> = {};

    for (const key in updateQuizItemDto) {
      if (updateQuizItemDto[key] !== undefined) {
        updatedQuizItem[key] = updateQuizItemDto[key];
      }
    }

    return this.quizItemsModel.findByIdAndUpdate(id, updatedQuizItem, { new: true }).exec();
  }

  remove(id: string) {
    return this.quizItemsModel.findByIdAndDelete(id).exec();
  }
}
