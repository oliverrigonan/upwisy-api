import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { LessonsService } from './lessons.service';

@ApiTags('Lessons')
@Controller('api/lessons')
export class LessonsController {

  constructor(
    private readonly lessonsService: LessonsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.lessonsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-course-id/:course_id')
  async findByCourseId(@Param('course_id') course_id: string) {
    const lessons = await this.lessonsService.findByCourseId(course_id);
    if (!lessons || lessons.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No lessons found for the specified course ID',
          error: `No lessons found with course ID ${course_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return lessons;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lesson = await this.lessonsService.findOne(id);
    if (!lesson) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Lesson not found',
          error: `The lesson with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return lesson;
  }
}
