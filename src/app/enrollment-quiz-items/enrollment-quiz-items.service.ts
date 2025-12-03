import { Injectable } from '@nestjs/common';
import { CreateEnrollmentQuizItemDto } from './dto/create-enrollment-quiz-item.dto';
import { UpdateEnrollmentQuizItemDto } from './dto/update-enrollment-quiz-item.dto';

@Injectable()
export class EnrollmentQuizItemsService {
  create(createEnrollmentQuizItemDto: CreateEnrollmentQuizItemDto) {
    return 'This action adds a new enrollmentQuizItem';
  }

  findAll() {
    return `This action returns all enrollmentQuizItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentQuizItem`;
  }

  update(id: number, updateEnrollmentQuizItemDto: UpdateEnrollmentQuizItemDto) {
    return `This action updates a #${id} enrollmentQuizItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentQuizItem`;
  }
}
