import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentLessonsService } from './enrollment-lessons.service';

import { CreateEnrollmentLessonDto } from './dto/create-enrollment-lesson.dto';
import { UpdateEnrollmentLessonDto } from './dto/update-enrollment-lesson.dto';

@ApiTags('Enrollment Lessons')
@Controller('api/enrollment-lessons')
export class EnrollmentLessonsController {

  constructor(
    private readonly enrollmentLessonsService: EnrollmentLessonsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createEnrollmentLessonDto: CreateEnrollmentLessonDto) {
    try {
      return await this.enrollmentLessonsService.create(createEnrollmentLessonDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment lesson',
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
    return await this.enrollmentLessonsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-id/:enrollment_id')
  async findByEnrollmentId(@Param('enrollment_id') enrollment_id: string) {
    const enrollmentLessons = await this.enrollmentLessonsService.findByEnrollmentId(enrollment_id);
    if (!enrollmentLessons || enrollmentLessons.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No enrollment lessons found for the specified enrollment ID',
          error: `No enrollment lessons found with enrollment ID ${enrollment_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollmentLessons;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentLesson = await this.enrollmentLessonsService.findOne(id);
    if (!enrollmentLesson) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Enrollment lesson not found',
          error: `The enrollment lesson with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollmentLesson;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnrollmentLessonDto: UpdateEnrollmentLessonDto) {
    try {
      const enrollmentLesson = await this.enrollmentLessonsService.findOne(id);
      if (!enrollmentLesson) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment lesson not found',
            error: `The enrollment lesson with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentLessonsService.update(id, updateEnrollmentLessonDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment lesson',
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
      const enrollmentLesson = await this.enrollmentLessonsService.findOne(id);
      if (!enrollmentLesson) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment lesson not found',
            error: `The enrollment lesson with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentLessonsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove enrollment lesson',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
