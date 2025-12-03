import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';

import { CreateEnrollmentQuizItemDto } from './dto/create-enrollment-quiz-item.dto';
import { UpdateEnrollmentQuizItemDto } from './dto/update-enrollment-quiz-item.dto';

@ApiTags('Enrollment Quiz Items')
@Controller('api/enrollment-quiz-items')
export class EnrollmentQuizItemsController {

  constructor(
    private readonly enrollmentQuizItemsService: EnrollmentQuizItemsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createEnrollmentQuizItemDto: CreateEnrollmentQuizItemDto) {
    try {
      return await this.enrollmentQuizItemsService.create(createEnrollmentQuizItemDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment quiz item',
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
    return await this.enrollmentQuizItemsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-quiz-id/:enrollment_quiz_id')
  async findByEnrollmentQuizId(@Param('enrollment_quiz_id') enrollment_quiz_id: string) {
    const enrollmentQuizItems = await this.enrollmentQuizItemsService.findByEnrollmentQuizId(enrollment_quiz_id);
    if (!enrollmentQuizItems || enrollmentQuizItems.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No enrollment quiz items found for the specified enrollment quiz ID',
          error: `No enrollment quiz items found with enrollment quiz ID ${enrollment_quiz_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollmentQuizItems;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentQuizItem = await this.enrollmentQuizItemsService.findOne(id);
    if (!enrollmentQuizItem) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Enrollment quiz item not found',
          error: `The enrollment quiz item with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollmentQuizItem;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnrollmentQuizItemDto: UpdateEnrollmentQuizItemDto) {
    try {
      const enrollmentQuizItem = await this.enrollmentQuizItemsService.findOne(id);
      if (!enrollmentQuizItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz item not found',
            error: `The enrollment quiz item with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentQuizItemsService.update(id, updateEnrollmentQuizItemDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment quiz item',
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
      const enrollmentQuizItem = await this.enrollmentQuizItemsService.findOne(id);
      if (!enrollmentQuizItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz-items not found',
            error: `The enrollment quiz-items with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentQuizItemsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove enrollment quiz item',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
