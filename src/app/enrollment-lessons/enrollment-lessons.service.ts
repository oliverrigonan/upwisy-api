import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { EnrollmentLesson } from './entities/enrollment-lesson.entity';

import { CreateEnrollmentLessonDto } from './dto/create-enrollment-lesson.dto';
import { UpdateEnrollmentLessonDto } from './dto/update-enrollment-lesson.dto';

export type EnrollmentLessonDocument = HydratedDocument<EnrollmentLesson>;

@Injectable()
export class EnrollmentLessonsService {

  constructor(
    @Inject('ENROLLMENT_LESSONS_MODEL')
    private enrollmentLessonsModel: Model<EnrollmentLessonDocument>,
  ) { }

  async create(createEnrollmentLessonDto: CreateEnrollmentLessonDto) {
    const newEnrollmentLesson: EnrollmentLesson = {
      enrollment_id: createEnrollmentLessonDto.enrollment_id,
      lesson_id: createEnrollmentLessonDto.lesson_id,
      total_lesson_sections: createEnrollmentLessonDto.total_lesson_sections,
      lesson_sections_completed: createEnrollmentLessonDto.lesson_sections_completed,
      status: createEnrollmentLessonDto.status,
      completed_at: createEnrollmentLessonDto.completed_at,
    };

    const createdEnrollmentLesson = new this.enrollmentLessonsModel(newEnrollmentLesson);
    return await createdEnrollmentLesson.save();
  }

  async findAll() {
    return await this.enrollmentLessonsModel.find().exec();
  }

  async findByEnrollmentId(enrollment_id: string) {
    return await this.enrollmentLessonsModel.find({
      enrollment_id: enrollment_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.enrollmentLessonsModel.findById(id).exec();
  }

  update(id: string, updateEnrollmentLessonDto: UpdateEnrollmentLessonDto) {
    const updatedEnrollmentLesson: Partial<EnrollmentLesson> = {};

    for (const key in updateEnrollmentLessonDto) {
      if (updateEnrollmentLessonDto[key] !== undefined) {
        updatedEnrollmentLesson[key] = updateEnrollmentLessonDto[key];
      }
    }

    return this.enrollmentLessonsModel.findByIdAndUpdate(id, updatedEnrollmentLesson, { new: true }).exec();
  }

  remove(id: string) {
    return this.enrollmentLessonsModel.findByIdAndDelete(id).exec();
  }
}
