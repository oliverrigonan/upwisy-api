import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CoursesService } from './../../services/courses/courses.service';
import { Course } from 'src/interfaces/course/course.interface';

import { CreateCourseDto } from 'src/dtos/courses/create-course.dto';
import { UpdateCourseDto } from 'src/dtos/courses/update-course.dto';

@ApiTags('Courses')
@Controller('api/courses')
export class CoursesController {
    constructor(
        private readonly coursesService: CoursesService
    ) { }

    @Post()
    async create(@Body() body: CreateCourseDto) {
        try {
            const now = new Date();
            const newCourse: Course = {
                ...body,
                created_at: now,
                updated_at: now,
            };

            return this.coursesService.create(newCourse);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create course',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.coursesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.coursesService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateCourseDto) {
        try {
            const course = await this.coursesService.findOne(id);
            if (!course) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Course not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateCourse: Partial<Course> = {
                ...body,
                updated_at: new Date(),
            };

            return this.coursesService.update(id, updateCourse);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update course',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const course = await this.coursesService.findOne(id);
            if (!course) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Course not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.coursesService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete course',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
