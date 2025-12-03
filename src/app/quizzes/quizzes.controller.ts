import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { QuizzesService } from './quizzes.service';

@ApiTags('Quizzes')
@Controller('api/quizzes')
export class QuizzesController {

  constructor(
    private readonly quizzesService: QuizzesService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.quizzesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-course-id/:course_id')
  async findByCourseId(@Param('course_id') course_id: string) {
    const quizzes = await this.quizzesService.findByCourseId(course_id);
    if (!quizzes || quizzes.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No quizzes found for the specified course ID',
          error: `No quizzes found with course ID ${course_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quizzes;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const quiz = await this.quizzesService.findOne(id);
    if (!quiz) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Quiz not found',
          error: `The quiz with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quiz;
  }
}
