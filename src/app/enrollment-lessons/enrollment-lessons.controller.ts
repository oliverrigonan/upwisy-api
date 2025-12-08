import { Controller, Get, Patch, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentLessonsService } from './enrollment-lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@ApiTags('Enrollment Lessons')
@Controller('api/enrollment-lessons')
export class EnrollmentLessonsController {

  constructor(
    private readonly enrollmentLessonsService: EnrollmentLessonsService,
    private readonly enrollmentsService: EnrollmentsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-id/:enrollment_id')
  async findByEnrollmentId(@Param('enrollment_id') enrollment_id: string) {
    const enrollmentLessons = await this.enrollmentLessonsService.findByEnrollmentId(enrollment_id);
    return enrollmentLessons;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentLesson = await this.enrollmentLessonsService.findOne(id);
    return enrollmentLesson;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('start/:id')
  async start(@Param('id') id: string) {
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

      const enrollment = await this.enrollmentsService.findOne(enrollmentLesson.enrollment_id);
      if (!enrollment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment not found',
            error: `The enrollment with ID ${enrollmentLesson.enrollment_id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const startedSession = await this.enrollmentLessonsService.update(id, {
        status: 'in_progress',
      });

      await this.enrollmentsService.update(enrollmentLesson.enrollment_id, {
        status: 'active',
      });

      return startedSession;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update learning plan',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
