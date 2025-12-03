import { Injectable } from '@nestjs/common';
import { CreateEnrollmentLessonSectionDto } from './dto/create-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonSectionDto } from './dto/update-enrollment-lesson-section.dto';

@Injectable()
export class EnrollmentLessonSectionsService {
  create(createEnrollmentLessonSectionDto: CreateEnrollmentLessonSectionDto) {
    return 'This action adds a new enrollmentLessonSection';
  }

  findAll() {
    return `This action returns all enrollmentLessonSections`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentLessonSection`;
  }

  update(id: number, updateEnrollmentLessonSectionDto: UpdateEnrollmentLessonSectionDto) {
    return `This action updates a #${id} enrollmentLessonSection`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentLessonSection`;
  }
}
