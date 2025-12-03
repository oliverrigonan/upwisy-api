import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Enrollment } from './entities/enrollment.entity';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

export type EnrollmentDocument = HydratedDocument<Enrollment>;

@Injectable()
export class EnrollmentsService {

  constructor(
    @Inject('ENROLLMENTS_MODEL')
    private enrollmentsModel: Model<EnrollmentDocument>,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const newEnrollment: Enrollment = {
      user_id: createEnrollmentDto.user_id,
      course_id: createEnrollmentDto.course_id,
      enrolled_date: createEnrollmentDto.enrolled_date,
      is_anonymous: createEnrollmentDto.is_anonymous,
      display_name: createEnrollmentDto.display_name,
      session_id: createEnrollmentDto.session_id,
      total_lessons: createEnrollmentDto.total_lessons,
      lessons_completed: createEnrollmentDto.lessons_completed,
      quizzes_taken: createEnrollmentDto.quizzes_taken,
      status: createEnrollmentDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdEnrollment = new this.enrollmentsModel(newEnrollment);
    return await createdEnrollment.save();
  }

  async findAll() {
    return await this.enrollmentsModel.find().exec();
  }

  async findByUserId(user_id: string) {
    return await this.enrollmentsModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.enrollmentsModel.findById(id).exec();
  }

  update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const updatedEnrollment: Partial<Enrollment> = {};

    for (const key in updateEnrollmentDto) {
      if (updateEnrollmentDto[key] !== undefined) {
        updatedEnrollment[key] = updateEnrollmentDto[key];
      }
    }

    updatedEnrollment.updated_at = new Date();

    return this.enrollmentsModel.findByIdAndUpdate(id, updatedEnrollment, { new: true }).exec();
  }

  remove(id: string) {
    return this.enrollmentsModel.findByIdAndDelete(id).exec();
  }
}
