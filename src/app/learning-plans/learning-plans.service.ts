import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { LearningPlan } from './entities/learning-plan.entity';

import { CreateLearningPlanDto } from './dto/create-learning-plan.dto';
import { UpdateLearningPlanDto } from './dto/update-learning-plan.dto';

@Injectable()
export class LearningPlansService {

  constructor(
    @Inject('LEARNING_PLANS_MODEL')
    private learningPlansModel: Model<LearningPlan>,
  ) { }

  async create(createLearningPlanDto: CreateLearningPlanDto) {
    const newLearningPlan: LearningPlan = {
      user_id: createLearningPlanDto.user_id,
      resource_course_id: createLearningPlanDto.resource_course_id,
      resource_lesson_id: createLearningPlanDto.resource_lesson_id,
      resource_assessment_id: createLearningPlanDto.resource_assessment_id,
      date: new Date(createLearningPlanDto.date),
      start_time: createLearningPlanDto.start_time,
      end_time: createLearningPlanDto.end_time,
      repetition: createLearningPlanDto.repetition,
      days_of_week: createLearningPlanDto.days_of_week,
      ends: createLearningPlanDto.ends,
      ends_on_date: new Date(createLearningPlanDto.ends_on_date),
      notes: createLearningPlanDto.notes,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLearningPlan = new this.learningPlansModel(newLearningPlan);
    return await createdLearningPlan.save();
  }

  async findAll() {
    return await this.learningPlansModel.find().exec();
  }

  async findByDate(date_string: string) {
    const date = new Date(date_string);

    const start = new Date(date.setUTCHours(0, 0, 0, 0));
    const end = new Date(date.setUTCHours(23, 59, 59, 999));

    return await this.learningPlansModel.find({
      date: { $gte: start, $lte: end },
    }).exec();
  }

  async findByUserId(user_id: string) {
    return await this.learningPlansModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.learningPlansModel.findById(id).exec();
  }

  update(id: string, updateLearningPlanDto: UpdateLearningPlanDto) {
    const updatedLearningPlan: Partial<LearningPlan> = {
      date: updateLearningPlanDto.date ? new Date(updateLearningPlanDto.date) : undefined,
      start_time: updateLearningPlanDto.start_time,
      end_time: updateLearningPlanDto.end_time,
      repetition: updateLearningPlanDto.repetition,
      days_of_week: updateLearningPlanDto.days_of_week,
      ends: updateLearningPlanDto.ends,
      ends_on_date: updateLearningPlanDto.ends_on_date ? new Date(updateLearningPlanDto.ends_on_date) : undefined,
      notes: updateLearningPlanDto.notes,
      updated_at: new Date(),
    };

    return this.learningPlansModel.findByIdAndUpdate(id, updatedLearningPlan, { new: true }).exec();
  }

  remove(id: string) {
    return this.learningPlansModel.findByIdAndDelete(id).exec();
  }
}
