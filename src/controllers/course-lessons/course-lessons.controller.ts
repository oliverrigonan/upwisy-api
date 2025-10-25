import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CourseLessonsService } from './../../services/course-lessons/course-lessons.service';
import { CourseLesson } from 'src/interfaces/course-lesson/course-lesson.interface';

import { CreateCourseLessonDto } from 'src/dtos/course-lessons/create-course-lesson.dto';
import { UpdateCourseLessonDto } from 'src/dtos/course-lessons/update-course-lesson.dto';

@ApiTags('Course Lessons')
@Controller('api/course-lessons')
export class CourseLessonsController {
    constructor(
        private readonly courseLessonsService: CourseLessonsService
    ) { }

    @Post()
    async create(@Body() body: CreateCourseLessonDto) {
        try {
            const newCourseLesson: CourseLesson = {
                ...body
            };

            return this.courseLessonsService.create(newCourseLesson);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create courseLesson',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.courseLessonsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseLessonsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateCourseLessonDto) {
        try {
            const courseLesson = await this.courseLessonsService.findOne(id);
            if (!courseLesson) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'CourseLesson not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateCourseLesson: Partial<CourseLesson> = {
                ...body
            };

            return this.courseLessonsService.update(id, updateCourseLesson);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update courseLesson',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const courseLesson = await this.courseLessonsService.findOne(id);
            if (!courseLesson) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'CourseLesson not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.courseLessonsService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete courseLesson',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
