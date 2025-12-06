import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentQuizzesService } from './enrollment-quizzes.service';

import { CreateEnrollmentQuizDto } from './dto/create-enrollment-quiz.dto';
import { UpdateEnrollmentQuizDto } from './dto/update-enrollment-quiz.dto';

@ApiTags('Enrollment Quizzes')
@Controller('api/enrollment-quizzes')
export class EnrollmentQuizzesController {

  constructor(
    private readonly enrollmentQuizzesService: EnrollmentQuizzesService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createEnrollmentQuizDto: CreateEnrollmentQuizDto) {
    try {
      return await this.enrollmentQuizzesService.create(createEnrollmentQuizDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment quiz',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.enrollmentQuizzesService.findAll();
  }

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnrollmentQuizDto: UpdateEnrollmentQuizDto) {
    try {
      const enrollmentQuiz = await this.enrollmentQuizzesService.findOne(id);
      if (!enrollmentQuiz) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz not found',
            error: `The enrollment quiz with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentQuizzesService.update(id, updateEnrollmentQuizDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment quiz',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const enrollmentQuiz = await this.enrollmentQuizzesService.findOne(id);
      if (!enrollmentQuiz) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz not found',
            error: `The enrollment quiz with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentQuizzesService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove enrollment quiz',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
