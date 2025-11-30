import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { LessonSectionsService } from './lesson-sections.service';

import { CreateLessonSectionDto } from './dto/create-lesson-section.dto';
import { UpdateLessonSectionDto } from './dto/update-lesson-section.dto';

@ApiTags('Lesson Sections')
@Controller('lesson-sections')
export class LessonSectionsController {

  constructor(
    private readonly lessonSectionsService: LessonSectionsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createLessonSectionDto: CreateLessonSectionDto) {
    try {
      return await this.lessonSectionsService.create(createLessonSectionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create lesson section',
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
    return await this.lessonSectionsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-user-id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    const lessonSections = await this.lessonSectionsService.findByUserId(user_id);
    if (!lessonSections || lessonSections.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No lesson section found for the specified user ID',
          error: `No lesson section found with user ID ${user_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

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

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLessonSectionDto: UpdateLessonSectionDto) {
    try {
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

      return this.lessonSectionsService.update(id, updateLessonSectionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update lesson section',
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

      return this.lessonSectionsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove lesson section',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
