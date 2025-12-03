import { Injectable } from '@nestjs/common';
import { CreateEnrollmentLessonDto } from './dto/create-enrollment-lesson.dto';
import { UpdateEnrollmentLessonDto } from './dto/update-enrollment-lesson.dto';

@Injectable()
export class EnrollmentLessonsService {
  create(createEnrollmentLessonDto: CreateEnrollmentLessonDto) {
    return 'This action adds a new enrollmentLesson';
  }

  findAll() {
    return `This action returns all enrollmentLessons`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentLesson`;
  }

  update(id: number, updateEnrollmentLessonDto: UpdateEnrollmentLessonDto) {
    return `This action updates a #${id} enrollmentLesson`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentLesson`;
  }
}
