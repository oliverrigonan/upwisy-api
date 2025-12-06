import { Controller, Get, Post, Body, Patch, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';
import { EnrollmentLessonsService } from '../enrollment-lessons/enrollment-lessons.service';

import { CreateEnrollmentLessonSectionDto } from './dto/create-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonSectionDto } from './dto/update-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonDto } from '../enrollment-lessons/dto/update-enrollment-lesson.dto';

@ApiTags('Enrollment Lesson Sections')
@Controller('api/enrollment-lesson-sections')
export class EnrollmentLessonSectionsController {

  constructor(
    private readonly enrollmentLessonSectionsService: EnrollmentLessonSectionsService,
    private readonly enrollmentLessonsService: EnrollmentLessonsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createEnrollmentLessonSectionDto: CreateEnrollmentLessonSectionDto) {
    try {
      return await this.enrollmentLessonSectionsService.create(createEnrollmentLessonSectionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment lesson section',
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
    return await this.enrollmentLessonSectionsService.findAll();
  }

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

      const completeEnrollmentLessonSection: Partial<UpdateEnrollmentLessonSectionDto> = {
        status: 'completed',
        completed_at: new Date(),
      };

      const completedEnrollmentLessonSection = this.enrollmentLessonSectionsService.update(id, completeEnrollmentLessonSection);

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

      const completedEnrollmentLessonSections = await this.enrollmentLessonSectionsService.findByEnrollmentLessonIdAndStatus(enrollmentLessonSection.enrollment_lesson_id, 'completed');

      const updatedEnrollmentLesson: Partial<UpdateEnrollmentLessonDto> = {
        lesson_sections_completed: completedEnrollmentLessonSections.length,
      };
      await this.enrollmentLessonsService.update(enrollmentLessonSection.enrollment_lesson_id, updatedEnrollmentLesson);

      if (completedEnrollmentLessonSections.length === enrollmentLesson.total_lesson_sections) {
        const completedEnrollmentLesson: Partial<UpdateEnrollmentLessonDto> = {
          status: 'completed',
          completed_at: new Date(),
        };
        await this.enrollmentLessonsService.update(enrollmentLessonSection.enrollment_lesson_id, completedEnrollmentLesson);
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
