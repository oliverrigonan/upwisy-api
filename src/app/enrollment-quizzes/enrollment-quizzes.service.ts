import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { EnrollmentQuiz } from './entities/enrollment-quiz.entity';

import { CreateEnrollmentQuizDto } from './dto/create-enrollment-quiz.dto';
import { UpdateEnrollmentQuizDto } from './dto/update-enrollment-quiz.dto';

export type EnrollmentQuizDocument = HydratedDocument<EnrollmentQuiz>;

@Injectable()
export class EnrollmentQuizzesService {

  constructor(
    @Inject('ENROLLMENT_QUIZZES_MODEL')
    private enrollmentQuizzesModel: Model<EnrollmentQuizDocument>,
  ) { }

  async create(createEnrollmentQuizDto: CreateEnrollmentQuizDto) {
    const newEnrollmentQuiz: EnrollmentQuiz = {
      enrollment_id: createEnrollmentQuizDto.enrollment_id,
      quiz_id: createEnrollmentQuizDto.quiz_id,
      date_taken: createEnrollmentQuizDto.date_taken,
      total_quiz_items: createEnrollmentQuizDto.total_quiz_items,
      score: createEnrollmentQuizDto.score,
      comments: createEnrollmentQuizDto.comments,
      is_submitted: createEnrollmentQuizDto.is_submitted,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdEnrollmentQuiz = new this.enrollmentQuizzesModel(newEnrollmentQuiz);
    return await createdEnrollmentQuiz.save();
  }

  async findAll() {
    return await this.enrollmentQuizzesModel.find().exec();
  }

  async findByEnrollmentId(enrollment_id: string) {
    return await this.enrollmentQuizzesModel.find({
      enrollment_id: enrollment_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.enrollmentQuizzesModel.findById(id).exec();
  }

  update(id: string, updateEnrollmentQuizDto: UpdateEnrollmentQuizDto) {
    const updatedEnrollmentQuiz: Partial<EnrollmentQuiz> = {};

    for (const key in updateEnrollmentQuizDto) {
      if (updateEnrollmentQuizDto[key] !== undefined) {
        updatedEnrollmentQuiz[key] = updateEnrollmentQuizDto[key];
      }
    }

    return this.enrollmentQuizzesModel.findByIdAndUpdate(id, updatedEnrollmentQuiz, { new: true }).exec();
  }

  remove(id: string) {
    return this.enrollmentQuizzesModel.findByIdAndDelete(id).exec();
  }
}
