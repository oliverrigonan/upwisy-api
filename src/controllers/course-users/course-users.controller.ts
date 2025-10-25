import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CourseUsersService } from './../../services/course-users/course-users.service';
import { CourseUser } from 'src/interfaces/course-user/course-user.interface';

import { CreateCourseUserDto } from 'src/dtos/course-users/create-course-user.dto';
import { UpdateCourseUserDto } from 'src/dtos/course-users/update-course-user.dto';

@ApiTags('Course Users')
@Controller('api/course-users')
export class CourseUsersController {
    constructor(
        private readonly courseUsersService: CourseUsersService
    ) { }

    @Post()
    async create(@Body() body: CreateCourseUserDto) {
        try {
            const newCourseUser: CourseUser = {
                ...body
            };

            return this.courseUsersService.create(newCourseUser);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create courseUser',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.courseUsersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseUsersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateCourseUserDto) {
        try {
            const courseUser = await this.courseUsersService.findOne(id);
            if (!courseUser) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'CourseUser not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateCourseUser: Partial<CourseUser> = {
                ...body
            };

            return this.courseUsersService.update(id, updateCourseUser);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update courseUser',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const courseUser = await this.courseUsersService.findOne(id);
            if (!courseUser) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'CourseUser not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.courseUsersService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete courseUser',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
