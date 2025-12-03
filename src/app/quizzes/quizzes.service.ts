import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Quiz } from './entities/quiz.entity';

import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';

export type QuizDocument = HydratedDocument<Quiz>;

@Injectable()
export class QuizzesService {

  constructor(
    @Inject('QUIZZES_MODEL')
    private quizzesModel: Model<QuizDocument>,
  ) { }

  async create(createQuizDto: CreateQuizDto) {
    const newQuiz: Quiz = {
      course_id: createQuizDto.course_id,
      difficulty: createQuizDto.difficulty,
      total_items: createQuizDto.total_items,
      status: createQuizDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdQuiz = new this.quizzesModel(newQuiz);
    return await createdQuiz.save();
  }

  async findAll() {
    return await this.quizzesModel.find().exec();
  }

  async findByCourseId(course_id: string) {
    return await this.quizzesModel.find({
      course_id: course_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.quizzesModel.findById(id).exec();
  }

  update(id: string, updateQuizDto: UpdateQuizDto) {
    const updatedQuiz: Partial<Quiz> = {};

    for (const key in updateQuizDto) {
      if (updateQuizDto[key] !== undefined) {
        updatedQuiz[key] = updateQuizDto[key];
      }
    }

    updatedQuiz.updated_at = new Date();

    return this.quizzesModel.findByIdAndUpdate(id, updatedQuiz, { new: true }).exec();
  }

  remove(id: string) {
    return this.quizzesModel.findByIdAndDelete(id).exec();
  }
}
