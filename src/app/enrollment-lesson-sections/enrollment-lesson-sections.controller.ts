import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentLessonSectionsService } from './enrollment-lesson-sections.service';

import { CreateEnrollmentLessonSectionDto } from './dto/create-enrollment-lesson-section.dto';
import { UpdateEnrollmentLessonSectionDto } from './dto/update-enrollment-lesson-section.dto';

@ApiTags('Enrollment Lesson Sections')
@Controller('api/enrollment-lesson-sections')
export class EnrollmentLessonSectionsController {

  constructor(
    private readonly enrollmentLessonSectionsService: EnrollmentLessonSectionsService
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
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnrollmentLessonSectionDto: UpdateEnrollmentLessonSectionDto) {
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

      return this.enrollmentLessonSectionsService.update(id, updateEnrollmentLessonSectionDto);
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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const enrollmentLessonSection = await this.enrollmentLessonSectionsService.findOne(id);
      if (!enrollmentLessonSection) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment lesson-sections not found',
            error: `The enrollment lesson-sections with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentLessonSectionsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove enrollment lesson section',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
