import { Controller, Get, Patch, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { EnrollmentLessonsService } from '../enrollment-lessons/enrollment-lessons.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@ApiTags('Enrollment Lesson Sections')
@Controller('api/enrollment-lesson-sections')
export class EnrollmentLessonSectionsController {

  constructor(
    private readonly enrollmentLessonSectionsService: EnrollmentLessonSectionsService,
    private readonly enrollmentLessonsService: EnrollmentLessonsService,
    private readonly enrollmentsService: EnrollmentsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-lesson-id/:enrollment_lesson_id')
  async findByEnrollmentLessonId(@Param('enrollment_lesson_id') enrollment_lesson_id: string) {
    const enrollmentLessonSections = await this.enrollmentLessonSectionsService.findByEnrollmentLessonId(enrollment_lesson_id);
    return enrollmentLessonSections;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentLessonSection = await this.enrollmentLessonSectionsService.findOne(id);
    return enrollmentLessonSection;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('complete/:id')
  async complete(@Param('id') id: string) {
    try {
      const enrollmentLessonSection = await this.enrollmentLessonSectionsService.findOne(id);
      if (!enrollmentLessonSection) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment lesson section not found',
            error: `The enrollment lesson section with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const enrollmentLesson = await this.enrollmentLessonsService.findOne(enrollmentLessonSection.enrollment_lesson_id);
      if (!enrollmentLesson) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment lesson not found',
            error: `The enrollment lesson with ID ${enrollmentLessonSection.enrollment_lesson_id} does not exist.`,
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

      const completedEnrollmentLessonSection = await this.enrollmentLessonSectionsService.update(id, {
        status: 'completed',
        completed_at: new Date(),
      });

      const completedEnrollmentLessonSections = await this.enrollmentLessonSectionsService.findByEnrollmentLessonIdAndStatus(enrollmentLessonSection.enrollment_lesson_id, 'completed');
      await this.enrollmentLessonsService.update(enrollmentLessonSection.enrollment_lesson_id, {
        lesson_sections_completed: completedEnrollmentLessonSections.length,
      });

      if (completedEnrollmentLessonSections.length === enrollmentLesson.total_lesson_sections) {
        await this.enrollmentLessonsService.update(enrollmentLessonSection.enrollment_lesson_id, {
          status: 'completed',
          completed_at: new Date(),
        });
      }

      const enrollmentLessons = await this.enrollmentLessonsService.findByEnrollmentId(enrollmentLesson.enrollment_id);
      const completedEnrollmentLessons = enrollmentLessons.filter(el => el.status === 'completed');

      if (completedEnrollmentLessons.length === enrollmentLessons.length) {
        await this.enrollmentsService.update(enrollmentLesson.enrollment_id, {
          status: 'completed',
        });
      }

      return completedEnrollmentLessonSection;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment lesson section',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
