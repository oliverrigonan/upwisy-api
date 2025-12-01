import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Lesson } from './entities/lesson.entity';

import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';

export type LessonDocument = HydratedDocument<Lesson>;

@Injectable()
export class LessonsService {

  constructor(
    @Inject('LESSONS_MODEL')
    private lessonsModel: Model<LessonDocument>,
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

  async createMany(createLessonDtos: CreateLessonDto[]) {
    const newLessons: Lesson[] = createLessonDtos.map(createLessonDto => ({
      course_id: createLessonDto.course_id,
      title: createLessonDto.title,
      description: createLessonDto.description,
      lesson_number: createLessonDto.lesson_number,
      status: createLessonDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const createdLessons = await this.lessonsModel.insertMany(newLessons);
    return createdLessons;
  }

  async findAll() {
    return await this.lessonsModel.find().exec();
  }

  async findByCourseId(course_id: string) {
    return await this.lessonsModel.find({
      course_id: course_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.lessonsModel.findById(id).exec();
  }

  update(id: string, updateLessonDto: UpdateLessonDto) {
    const updatedLesson: Partial<Lesson> = {};

    for (const key in updateLessonDto) {
      if (updateLessonDto[key] !== undefined) {
        updatedLesson[key] = updateLessonDto[key];
      }
    }

    updatedLesson.updated_at = new Date();

    return this.lessonsModel.findByIdAndUpdate(id, updatedLesson, { new: true }).exec();
  }

  remove(id: string) {
    return this.lessonsModel.findByIdAndDelete(id).exec();
  }
}
