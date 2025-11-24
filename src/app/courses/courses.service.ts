import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Course } from './entities/course.entity';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {

  constructor(
    @Inject('COURSES_MODEL')
    private coursesModel: Model<Course>,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const newCourse: Course = {
      user_id: createCourseDto.user_id,
      date: new Date(createCourseDto.date),
      title: createCourseDto.title,
      details: createCourseDto.details,
      visibility: createCourseDto.visibility,
      owner_user_id: createCourseDto.owner_user_id,
      status: createCourseDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCourse = new this.coursesModel(newCourse);
    return await createdCourse.save();
  }

  async findAll() {
    return await this.coursesModel.find().exec();
  }

  async findOne(id: string) {
    return await this.coursesModel.findById(id).exec();
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse: Partial<Course> = {
      date: updateCourseDto.date ? new Date(updateCourseDto.date) : undefined,
      title: updateCourseDto.title,
      details: updateCourseDto.details,
      visibility: updateCourseDto.visibility,
      status: updateCourseDto.status,
      updated_at: new Date(),
    };

    return this.coursesModel.findByIdAndUpdate(id, updatedCourse, { new: true }).exec();
  }

  remove(id: string) {
    return this.coursesModel.findByIdAndDelete(id).exec();
  }
}
