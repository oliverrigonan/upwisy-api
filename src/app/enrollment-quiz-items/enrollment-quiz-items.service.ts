import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { EnrollmentQuizItem } from './entities/enrollment-quiz-item.entity';

import { CreateEnrollmentQuizItemDto } from './dto/create-enrollment-quiz-item.dto';
import { UpdateEnrollmentQuizItemDto } from './dto/update-enrollment-quiz-item.dto';

export type EnrollmentQuizItemDocument = HydratedDocument<EnrollmentQuizItem>;

@Injectable()
export class EnrollmentQuizItemsService {

  constructor(
    @Inject('ENROLLMENT_QUIZ_ITEMS_MODEL')
    private enrollmentQuizItemsModel: Model<EnrollmentQuizItemDocument>,
  ) { }

  async create(createEnrollmentQuizItemDto: CreateEnrollmentQuizItemDto) {
    const newEnrollmentQuizItem: EnrollmentQuizItem = {
      enrollment_quiz_id: createEnrollmentQuizItemDto.enrollment_quiz_id,
      quiz_item_id: createEnrollmentQuizItemDto.quiz_item_id,
      user_answer: createEnrollmentQuizItemDto.user_answer,
      is_correct: createEnrollmentQuizItemDto.is_correct,
      answered_at: createEnrollmentQuizItemDto.answered_at,
    };

    const createdEnrollmentQuizItem = new this.enrollmentQuizItemsModel(newEnrollmentQuizItem);
    return await createdEnrollmentQuizItem.save();
  }

  async findAll() {
    return await this.enrollmentQuizItemsModel.find().exec();
  }

  async findByEnrollmentQuizId(enrollment_quiz_id: string) {
    return await this.enrollmentQuizItemsModel.find({
      enrollment_quiz_id: enrollment_quiz_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.enrollmentQuizItemsModel.findById(id).exec();
  }

  update(id: string, updateEnrollmentQuizItemDto: UpdateEnrollmentQuizItemDto) {
    const updatedEnrollmentQuizItem: Partial<EnrollmentQuizItem> = {};

    for (const key in updateEnrollmentQuizItemDto) {
      if (updateEnrollmentQuizItemDto[key] !== undefined) {
        updatedEnrollmentQuizItem[key] = updateEnrollmentQuizItemDto[key];
      }
    }

    return this.enrollmentQuizItemsModel.findByIdAndUpdate(id, updatedEnrollmentQuizItem, { new: true }).exec();
  }

  remove(id: string) {
    return this.enrollmentQuizItemsModel.findByIdAndDelete(id).exec();
  }
}
