import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { AssessmentItem } from './entities/assessment-item.entity';

import { CreateAssessmentItemDto } from './dto/create-assessment-item.dto';
import { UpdateAssessmentItemDto } from './dto/update-assessment-item.dto';

export type AssessmentItemDocument = HydratedDocument<AssessmentItem>;

@Injectable()
export class AssessmentItemsService {

  constructor(
    @Inject('ASSESSMENT_ITEMS_MODEL')
    private assessmentItemsModel: Model<AssessmentItemDocument>,
  ) { }

  async create(createAssessmentItemDto: CreateAssessmentItemDto) {
    const newAssessmentItem: AssessmentItem = {
      assessment_id: createAssessmentItemDto.assessment_id,
      type: createAssessmentItemDto.type,
      question: createAssessmentItemDto.question,
      options: createAssessmentItemDto.options,
      correct_answer: createAssessmentItemDto.correct_answer,
      user_answer: createAssessmentItemDto.user_answer,
      percentage_correct: createAssessmentItemDto.percentage_correct,
      is_correct: createAssessmentItemDto.is_correct,
      answer_explanation: createAssessmentItemDto.answer_explanation,
    };

    const createdAssessmentItem = new this.assessmentItemsModel(newAssessmentItem);
    return await createdAssessmentItem.save();
  }

  async createMany(createAssessmentItemDtos: CreateAssessmentItemDto[]) {
    const newAssessmentItems: AssessmentItem[] = createAssessmentItemDtos.map(createAssessmentItemDto => ({
      assessment_id: createAssessmentItemDto.assessment_id,
      type: createAssessmentItemDto.type,
      question: createAssessmentItemDto.question,
      options: createAssessmentItemDto.options,
      correct_answer: createAssessmentItemDto.correct_answer,
      user_answer: createAssessmentItemDto.user_answer,
      percentage_correct: createAssessmentItemDto.percentage_correct,
      is_correct: createAssessmentItemDto.is_correct,
      answer_explanation: createAssessmentItemDto.answer_explanation,
    }));

    const createdAssessmentItems = await this.assessmentItemsModel.insertMany(newAssessmentItems);
    return createdAssessmentItems;
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
      type: updateAssessmentItemDto.type,
      question: updateAssessmentItemDto.question,
      options: updateAssessmentItemDto.options,
      correct_answer: updateAssessmentItemDto.correct_answer,
      user_answer: updateAssessmentItemDto.user_answer,
      percentage_correct: updateAssessmentItemDto.percentage_correct,
      is_correct: updateAssessmentItemDto.is_correct,
      answer_explanation: updateAssessmentItemDto.answer_explanation,
    };

    return this.assessmentItemsModel.findByIdAndUpdate(id, updatedAssessmentItem, { new: true }).exec();
  }

  remove(id: string) {
    return this.assessmentItemsModel.findByIdAndDelete(id).exec();
  }
}
