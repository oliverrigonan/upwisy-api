import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { LessonSectionsService } from './lesson-sections.service';

@ApiTags('Lesson Sections')
@Controller('api/lesson-sections')
export class LessonSectionsController {

  constructor(
    private readonly lessonSectionsService: LessonSectionsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.lessonSectionsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-lesson-id/:lesson_id')
  async findByLessonId(@Param('lesson_id') lesson_id: string) {
    const lessonSections = await this.lessonSectionsService.findByLessonId(lesson_id);
    return lessonSections;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const lessonSection = await this.lessonSectionsService.findOne(id);
    if (!lessonSection) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Lesson section not found',
          error: `The lesson section with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return lessonSection;
  }
}
