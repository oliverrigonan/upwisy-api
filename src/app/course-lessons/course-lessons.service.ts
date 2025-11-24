import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CourseLesson } from './entities/course-lesson.entity';

import { CreateCourseLessonDto } from './dto/create-course-lesson.dto';
import { UpdateCourseLessonDto } from './dto/update-course-lesson.dto';

@Injectable()
export class CourseLessonsService {

  constructor(
    @Inject('COURSE_LESSONS_MODEL')
    private courseLessonsModel: Model<CourseLesson>,
  ) { }

  async create(createCourseLessonDto: CreateCourseLessonDto) {
    const newCourseLesson: CourseLesson = {
      course_id: createCourseLessonDto.course_id,
      title: createCourseLessonDto.title,
      lesson: createCourseLessonDto.lesson,
      status: createCourseLessonDto.status,
    };

    const createdCourseLesson = new this.courseLessonsModel(newCourseLesson);
    return await createdCourseLesson.save();
  }

  async findAll() {
    return await this.courseLessonsModel.find().exec();
  }

  async findByCourseId(course_id: string) {
    return await this.courseLessonsModel.find({
      course_id: course_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.courseLessonsModel.findById(id).exec();
  }

  update(id: string, updateCourseLessonDto: UpdateCourseLessonDto) {
    const updatedCourseLesson: Partial<CourseLesson> = {
      title: updateCourseLessonDto.title,
      lesson: updateCourseLessonDto.lesson,
      status: updateCourseLessonDto.status,
    };

    return this.courseLessonsModel.findByIdAndUpdate(id, updatedCourseLesson, { new: true }).exec();
  }

  remove(id: string) {
    return this.courseLessonsModel.findByIdAndDelete(id).exec();
  }
}
