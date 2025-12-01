import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Assessment } from './entities/assessment.entity';

import { CreateAssessmentDto } from './dto/create-assessment.dto';
import { UpdateAssessmentDto } from './dto/update-assessment.dto';

export type AssessmentDocument = HydratedDocument<Assessment>;

@Injectable()
export class AssessmentsService {

  constructor(
    @Inject('ASSESSMENTS_MODEL')
    private assessmentsModel: Model<AssessmentDocument>,
  ) { }

  async create(createAssessmentDto: CreateAssessmentDto) {
    const newAssessment: Assessment = {
      user_id: createAssessmentDto.user_id,
      type: createAssessmentDto.type,
      base_course_id: createAssessmentDto.base_course_id,
      base_lesson_id: createAssessmentDto.base_lesson_id,
      base_file_id: createAssessmentDto.base_file_id,
      difficulty: createAssessmentDto.difficulty,
      total_items: createAssessmentDto.total_items,
      score: createAssessmentDto.score,
      comments: createAssessmentDto.comments,
      is_submitted: createAssessmentDto.is_submitted,
      start_time: new Date(createAssessmentDto.start_time),
      end_time: createAssessmentDto.end_time ? new Date(createAssessmentDto.end_time) : null,
      duration_seconds: createAssessmentDto.duration_seconds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdAssessment = new this.assessmentsModel(newAssessment);
    return await createdAssessment.save();
  }

  async createMany(createAssessmentDtos: CreateAssessmentDto[]) {
    const newAssessments: Assessment[] = createAssessmentDtos.map(createAssessmentDto => ({
      user_id: createAssessmentDto.user_id,
      type: createAssessmentDto.type,
      base_course_id: createAssessmentDto.base_course_id,
      base_lesson_id: createAssessmentDto.base_lesson_id,
      base_file_id: createAssessmentDto.base_file_id,
      difficulty: createAssessmentDto.difficulty,
      total_items: createAssessmentDto.total_items,
      score: createAssessmentDto.score,
      comments: createAssessmentDto.comments,
      is_submitted: createAssessmentDto.is_submitted,
      start_time: new Date(createAssessmentDto.start_time),
      end_time: createAssessmentDto.end_time ? new Date(createAssessmentDto.end_time) : null,
      duration_seconds: createAssessmentDto.duration_seconds,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const createdAssessments = await this.assessmentsModel.insertMany(newAssessments);
    return createdAssessments;
  }

  async findAll() {
    return await this.assessmentsModel.find().exec();
  }

  async findByUserId(user_id: string) {
    return await this.assessmentsModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.assessmentsModel.findById(id).exec();
  }

  update(id: string, updateAssessmentDto: UpdateAssessmentDto) {
    const updatedAssessment: Partial<Assessment> = {
      type: updateAssessmentDto.type,
      difficulty: updateAssessmentDto.difficulty,
      total_items: updateAssessmentDto.total_items,
      score: updateAssessmentDto.score,
      comments: updateAssessmentDto.comments,
      is_submitted: updateAssessmentDto.is_submitted,
      end_time: updateAssessmentDto.end_time ? new Date(updateAssessmentDto.end_time) : undefined,
      duration_seconds: updateAssessmentDto.duration_seconds,
      updated_at: new Date(),
    };

    return this.assessmentsModel.findByIdAndUpdate(id, updatedAssessment, { new: true }).exec();
  }

  remove(id: string) {
    return this.assessmentsModel.findByIdAndDelete(id).exec();
  }
}
