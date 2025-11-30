import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { LessonSection } from './entities/lesson-section.entity';

import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';

@Injectable()
export class LessonSectionsService {

  constructor(
    @Inject('LESSON_SECTIONS_MODEL')
    private lessonSectionsModel: Model<LessonSection>,
  ) { }

  async create(createLessonSectionDto: CreateLessonSectionDto) {
    const newLessonSection: LessonSection = {
      lesson_id: createLessonSectionDto.lesson_id,
      section_number: createLessonSectionDto.section_number,
      title: createLessonSectionDto.title,
      content: createLessonSectionDto.content,
      tokens_used: createLessonSectionDto.tokens_used,
      status: createLessonSectionDto.status,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdLessonSection = new this.lessonSectionsModel(newLessonSection);
    return await createdLessonSection.save();
  }

  async findAll() {
    return await this.lessonSectionsModel.find().exec();
  }

  async findByUserId(user_id: string) {
    return await this.lessonSectionsModel.find({
      user_id: user_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.lessonSectionsModel.findById(id).exec();
  }

  update(id: string, updateLessonSectionDto: UpdateLessonSectionDto) {
    const updatedLessonSection: Partial<LessonSection> = {
      title: updateLessonSectionDto.title,
      content: updateLessonSectionDto.content,
      tokens_used: updateLessonSectionDto.tokens_used,
      status: updateLessonSectionDto.status,
      updated_at: new Date(),
    };

    return this.lessonSectionsModel.findByIdAndUpdate(id, updatedLessonSection, { new: true }).exec();
  }

  remove(id: string) {
    return this.lessonSectionsModel.findByIdAndDelete(id).exec();
  }
}
