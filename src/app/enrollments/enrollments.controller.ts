import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentsService } from './enrollments.service';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';

@ApiTags('Enrollments')
@Controller('api/enrollments')
export class EnrollmentsController {

  constructor(
    private readonly enrollmentsService: EnrollmentsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    try {
      return await this.enrollmentsService.create(createEnrollmentDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment',
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
    return await this.enrollmentsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-user-id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    const enrollments = await this.enrollmentsService.findByUserId(user_id);
    if (!enrollments || enrollments.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No enrollments found for the specified user ID',
          error: `No enrollments found with user ID ${user_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollments;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollment = await this.enrollmentsService.findOne(id);
    if (!enrollment) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Enrollment not found',
          error: `The enrollment with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return enrollment;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    try {
      const enrollment = await this.enrollmentsService.findOne(id);
      if (!enrollment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment not found',
            error: `The enrollment with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentsService.update(id, updateEnrollmentDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment',
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
      const enrollment = await this.enrollmentsService.findOne(id);
      if (!enrollment) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment not found',
            error: `The enrollment with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.enrollmentsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove enrollment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
