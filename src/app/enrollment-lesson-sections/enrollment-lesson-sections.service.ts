import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { EnrollmentLessonSection } from './entities/enrollment-lesson-section.entity';

import { CreateEnrollmentLessonSectionDto } from './dto/create-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonSectionDto } from './dto/update-enrollment-lesson-section.dto';

export type EnrollmentLessonSectionDocument = HydratedDocument<EnrollmentLessonSection>;

@Injectable()
export class EnrollmentLessonSectionsService {

  constructor(
    @Inject('ENROLLMENT_LESSON_SECTIONS_MODEL')
    private enrollmentLessonSectionsModel: Model<EnrollmentLessonSectionDocument>,
  ) { }

  async create(createEnrollmentLessonSectionDto: CreateEnrollmentLessonSectionDto) {
    const newEnrollmentLessonSection: EnrollmentLessonSection = {
      enrollment_lesson_id: createEnrollmentLessonSectionDto.enrollment_lesson_id,
      lesson_section_id: createEnrollmentLessonSectionDto.lesson_section_id,
      status: createEnrollmentLessonSectionDto.status,
      started_at: createEnrollmentLessonSectionDto.started_at,
      completed_at: createEnrollmentLessonSectionDto.completed_at,
    };

    const createdEnrollmentLessonSection = new this.enrollmentLessonSectionsModel(newEnrollmentLessonSection);
    return await createdEnrollmentLessonSection.save();
  }

  async createMany(createEnrollmentLessonSectionDtos: CreateEnrollmentLessonSectionDto[]) {
    const newEnrollmentLessonSections: EnrollmentLessonSection[] = createEnrollmentLessonSectionDtos.map(createEnrollmentLessonSectionDto => ({
      enrollment_lesson_id: createEnrollmentLessonSectionDto.enrollment_lesson_id,
      lesson_section_id: createEnrollmentLessonSectionDto.lesson_section_id,
      status: createEnrollmentLessonSectionDto.status,
      started_at: createEnrollmentLessonSectionDto.started_at,
      completed_at: createEnrollmentLessonSectionDto.completed_at,
    }));

    const createdEnrollmentLessonSections = await this.enrollmentLessonSectionsModel.insertMany(newEnrollmentLessonSections);
    return createdEnrollmentLessonSections;
  }

  async findAll() {
    return await this.enrollmentLessonSectionsModel
      .find()
      .populate('lesson_section')
      .exec();
  }

  async findByEnrollmentLessonId(enrollment_lesson_id: string) {
    return await this.enrollmentLessonSectionsModel
      .find({
        enrollment_lesson_id: enrollment_lesson_id,
      })
      .populate('lesson_section')
      .exec();
  }

  async findOne(id: string) {
    return await this.enrollmentLessonSectionsModel
      .findById(id)
      .populate('lesson_section')
      .exec();
  }

  async update(id: string, updateEnrollmentLessonSectionDto: UpdateEnrollmentLessonSectionDto) {
    const updatedEnrollmentLessonSection: Partial<EnrollmentLessonSection> = {};

    for (const key in updateEnrollmentLessonSectionDto) {
      if (updateEnrollmentLessonSectionDto[key] !== undefined) {
        updatedEnrollmentLessonSection[key] = updateEnrollmentLessonSectionDto[key];
      }
    }

    return await this.enrollmentLessonSectionsModel.findByIdAndUpdate(id, updatedEnrollmentLessonSection, { new: true }).exec();
  }

  async remove(id: string) {
    return await this.enrollmentLessonSectionsModel.findByIdAndDelete(id).exec();
  }
}
