import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentQuizzesService } from './enrollment-quizzes.service';

@ApiTags('Enrollment Quizzes')
@Controller('api/enrollment-quizzes')
export class EnrollmentQuizzesController {

  constructor(
    private readonly enrollmentQuizzesService: EnrollmentQuizzesService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-id/:enrollment_id')
  async findByEnrollmentId(@Param('enrollment_id') enrollment_id: string) {
    const enrollmentQuizzes = await this.enrollmentQuizzesService.findByEnrollmentId(enrollment_id);
    return enrollmentQuizzes;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentQuiz = await this.enrollmentQuizzesService.findOne(id);
    return enrollmentQuiz;
  }
}
