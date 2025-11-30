import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Lesson } from './entities/lesson.entity';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

@Injectable()
export class LessonsService {

  constructor(
    @Inject('LESSONS_MODEL')
    private lessonsModel: Model<Lesson>,
  ) { }

  async create(createLessonDto: CreateLessonDto) {
    const newLesson: Lesson = {
      course_id: createLessonDto.course_id,
      title: createLessonDto.title,
      description: createLessonDto.description,
      lesson_number: createLessonDto.lesson_number,
      status: createLessonDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLesson = new this.lessonsModel(newLesson);
    return await createdLesson.save();
  }

  async findAll() {
    return await this.lessonsModel.find().exec();
  }

  async findByUserId(user_id: string) {
    return await this.lessonsModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.lessonsModel.findById(id).exec();
  }

  update(id: string, updateLessonDto: UpdateLessonDto) {
    const updatedLesson: Partial<Lesson> = {
      title: updateLessonDto.title,
      description: updateLessonDto.description,
      lesson_number: updateLessonDto.lesson_number,
      status: updateLessonDto.status,
      updated_at: new Date(),
    };

    return this.lessonsModel.findByIdAndUpdate(id, updatedLesson, { new: true }).exec();
  }

  remove(id: string) {
    return this.lessonsModel.findByIdAndDelete(id).exec();
  }
}
