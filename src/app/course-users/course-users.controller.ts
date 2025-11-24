import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { CourseUsersService } from './course-users.service';

import { CreateCourseUserDto } from './dto/create-course-user.dto';
import { UpdateCourseUserDto } from './dto/update-course-user.dto';

@ApiTags('Course Users')
@Controller('api/course-users')
export class CourseUsersController {

  constructor(
    private readonly courseUsersService: CourseUsersService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createCourseUserDto: CreateCourseUserDto) {
    try {
      return await this.courseUsersService.create(createCourseUserDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create course user',
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
    return await this.courseUsersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-course-id/:course_id')
  async findByCourseId(@Param('course_id') course_id: string) {
    const courseUsers = await this.courseUsersService.findByCourseId(course_id);
    if (!courseUsers || courseUsers.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No course users found for the specified course ID',
          error: `No course users found with course ID ${course_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return courseUsers;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const courseUser = await this.courseUsersService.findOne(id);
    if (!courseUser) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Course user not found',
          error: `The course user with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return courseUser;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseUserDto: UpdateCourseUserDto) {
    try {
      const courseUser = await this.courseUsersService.findOne(id);
      if (!courseUser) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Course user not found',
            error: `The course user with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.courseUsersService.update(id, updateCourseUserDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update course user',
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
      const courseUser = await this.courseUsersService.findOne(id);
      if (!courseUser) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Course user not found',
            error: `The course user with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.courseUsersService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove course user',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
