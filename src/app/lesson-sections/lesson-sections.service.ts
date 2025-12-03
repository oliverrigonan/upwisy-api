import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { LessonSection } from './entities/lesson-section.entity';

import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';

export type LessonSectionDocument = HydratedDocument<LessonSection>;

@Injectable()
export class LessonSectionsService {

  constructor(
    @Inject('LESSON_SECTIONS_MODEL')
    private lessonSectionsModel: Model<LessonSectionDocument>,
  ) { }

  async create(createLessonSectionDto: CreateLessonSectionDto) {
    const newLessonSection: LessonSection = {
      lesson_id: createLessonSectionDto.lesson_id,
      title: createLessonSectionDto.title,
      topics: createLessonSectionDto.topics,
      content: createLessonSectionDto.content,
      summary: createLessonSectionDto.summary,
      tokens_used: createLessonSectionDto.tokens_used,
      status: createLessonSectionDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLessonSection = new this.lessonSectionsModel(newLessonSection);
    return await createdLessonSection.save();
  }

  async createMany(createLessonSectionDtos: CreateLessonSectionDto[]) {
    const newLessonSections: LessonSection[] = createLessonSectionDtos.map(createLessonSectionDto => ({
      lesson_id: createLessonSectionDto.lesson_id,
      title: createLessonSectionDto.title,
      topics: createLessonSectionDto.topics,
      content: createLessonSectionDto.content,
      summary: createLessonSectionDto.summary,
      tokens_used: createLessonSectionDto.tokens_used,
      status: createLessonSectionDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    const createdLessonSections = await this.lessonSectionsModel.insertMany(newLessonSections);
    return createdLessonSections;
  }

  async findAll() {
    return await this.lessonSectionsModel.find().exec();
  }

  async findByLessonId(lesson_id: string) {
    return await this.lessonSectionsModel.find({
      lesson_id: lesson_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.lessonSectionsModel.findById(id).exec();
  }

  update(id: string, updateLessonSectionDto: UpdateLessonSectionDto) {
    const updatedLessonSection: Partial<LessonSection> = {};

    for (const key in updateLessonSectionDto) {
      if (updateLessonSectionDto[key] !== undefined) {
        updatedLessonSection[key] = updateLessonSectionDto[key];
      }
    }

    updatedLessonSection.updated_at = new Date();

    return this.lessonSectionsModel.findByIdAndUpdate(id, updatedLessonSection, { new: true }).exec();
  }

  remove(id: string) {
    return this.lessonSectionsModel.findByIdAndDelete(id).exec();
  }
}
