import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CourseSession } from './entities/course-session.entity';

import { CreateCourseSessionDto } from './dto/create-course-session.dto';
import { UpdateCourseSessionDto } from './dto/update-course-session.dto';

@Injectable()
export class CourseSessionsService {

  constructor(
    @Inject('COURSE_SESSIONS_MODEL')
    private courseSessionsModel: Model<CourseSession>,
  ) { }

  async create(createCourseSessionDto: CreateCourseSessionDto) {
    const newCourseSession: CourseSession = {
      user_id: createCourseSessionDto.user_id,
      course_id: createCourseSessionDto.course_id,
      course_lesson_id: createCourseSessionDto.course_lesson_id,
      start_time: createCourseSessionDto.start_time,
      end_time: createCourseSessionDto.end_time,
      duration_seconds: createCourseSessionDto.duration_seconds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCourseSession = new this.courseSessionsModel(newCourseSession);
    return await createdCourseSession.save();
  }

  async findAll() {
    return await this.courseSessionsModel.find().exec();
  }

  async findOne(id: string) {
    return await this.courseSessionsModel.findById(id).exec();
  }

  update(id: string, updateCourseSessionDto: UpdateCourseSessionDto) {
    const updatedCourseSession: Partial<CourseSession> = {
      course_lesson_id: updateCourseSessionDto.course_lesson_id,
      start_time: updateCourseSessionDto.start_time,
      end_time: updateCourseSessionDto.end_time,
      duration_seconds: updateCourseSessionDto.duration_seconds,
      updated_at: new Date(),
    };

    return this.courseSessionsModel.findByIdAndUpdate(id, updatedCourseSession, { new: true }).exec();
  }

  remove(id: string) {
    return this.courseSessionsModel.findByIdAndDelete(id).exec();
  }
}
