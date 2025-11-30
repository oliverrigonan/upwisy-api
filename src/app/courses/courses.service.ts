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
    const updatedCourse: Partial<Course> = {
      title: updateCourseDto.title,
      description: updateCourseDto.description,
      thumbnail_url: updateCourseDto.thumbnail_url,
      difficulty: updateCourseDto.difficulty,
      visibility: updateCourseDto.visibility,
      status: updateCourseDto.status,
      total_lessons: updateCourseDto.total_lessons,
      total_sections: updateCourseDto.total_sections,
      updated_at: new Date(),
    };

    return this.coursesModel.findByIdAndUpdate(id, updatedCourse, { new: true }).exec();
  }

  remove(id: string) {
    return this.coursesModel.findByIdAndDelete(id).exec();
  }
}
