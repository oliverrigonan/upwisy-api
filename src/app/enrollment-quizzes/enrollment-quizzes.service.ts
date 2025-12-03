import { Injectable } from '@nestjs/common';
import { CreateEnrollmentQuizzDto } from './dto/create-enrollment-quizz.dto';
import { UpdateEnrollmentQuizzDto } from './dto/update-enrollment-quizz.dto';

@Injectable()
export class EnrollmentQuizzesService {
  create(createEnrollmentQuizzDto: CreateEnrollmentQuizzDto) {
    return 'This action adds a new enrollmentQuizz';
  }

  findAll() {
    return `This action returns all enrollmentQuizzes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollmentQuizz`;
  }

  update(id: number, updateEnrollmentQuizzDto: UpdateEnrollmentQuizzDto) {
    return `This action updates a #${id} enrollmentQuizz`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollmentQuizz`;
  }
}
