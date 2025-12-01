import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Course } from './entities/course.entity';

import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

export type CourseDocument = HydratedDocument<Course>;

@Injectable()
export class CoursesService {

  constructor(
    @Inject('COURSES_MODEL')
    private coursesModel: Model<CourseDocument>,
  ) { }

  async create(createCourseDto: CreateCourseDto) {
    const newCourse: Course = {
      user_id: createCourseDto.user_id,
      title: createCourseDto.title,
      description: createCourseDto.description,
      thumbnail_url: createCourseDto.thumbnail_url,
      difficulty: createCourseDto.difficulty,
      visibility: createCourseDto.visibility,
      status: createCourseDto.status,
      total_lessons: createCourseDto.total_lessons,
      total_sections: createCourseDto.total_sections,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdCourse = new this.coursesModel(newCourse);
    return await createdCourse.save();
  }

  async findAll() {
    return await this.coursesModel.find().exec();
  }

  async findByUserId(user_id: string) {
    return await this.coursesModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.coursesModel.findById(id).exec();
  }

  update(id: string, updateCourseDto: UpdateCourseDto) {
    const updatedCourse: Partial<Course> = {};

    for (const key in updateCourseDto) {
      if (updateCourseDto[key] !== undefined) {
        updatedCourse[key] = updateCourseDto[key];
      }
    }

    updatedCourse.updated_at = new Date();

    return this.coursesModel.findByIdAndUpdate(id, updatedCourse, { new: true }).exec();
  }

  remove(id: string) {
    return this.coursesModel.findByIdAndDelete(id).exec();
  }
}
