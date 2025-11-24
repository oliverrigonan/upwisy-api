import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { AssessmentItem } from './entities/assessment-item.entity';

import { CreateAssessmentItemDto } from './dto/create-assessment-item.dto';
import { UpdateAssessmentItemDto } from './dto/update-assessment-item.dto';

@Injectable()
export class AssessmentItemsService {

  constructor(
    @Inject('ASSESSMENT_ITEMS_MODEL')
    private assessmentItemsModel: Model<AssessmentItem>,
  ) { }

  async create(createAssessmentItemDto: CreateAssessmentItemDto) {
    const newAssessmentItem: AssessmentItem = {
      assessment_id: createAssessmentItemDto.assessment_id,
      question: createAssessmentItemDto.question,
      options: createAssessmentItemDto.options,
      correct_answer: createAssessmentItemDto.correct_answer,
      user_answer: createAssessmentItemDto.user_answer,
      is_correct: createAssessmentItemDto.is_correct,
    };

    const createdAssessmentItem = new this.assessmentItemsModel(newAssessmentItem);
    return await createdAssessmentItem.save();
  }

  async findAll() {
    return await this.assessmentItemsModel.find().exec();
  }

  async findByAssessmentId(assessment_id: string) {
    return await this.assessmentItemsModel.find({
      assessment_id: assessment_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.assessmentItemsModel.findById(id).exec();
  }

  update(id: string, updateAssessmentItemDto: UpdateAssessmentItemDto) {
    const updatedAssessmentItem: Partial<AssessmentItem> = {
      question: updateAssessmentItemDto.question,
      options: updateAssessmentItemDto.options,
      correct_answer: updateAssessmentItemDto.correct_answer,
      user_answer: updateAssessmentItemDto.user_answer,
      is_correct: updateAssessmentItemDto.is_correct,
    };

    return this.assessmentItemsModel.findByIdAndUpdate(id, updatedAssessmentItem, { new: true }).exec();
  }

  remove(id: string) {
    return this.assessmentItemsModel.findByIdAndDelete(id).exec();
  }
}
