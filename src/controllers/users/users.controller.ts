import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UsersService } from './../../services/users/users.service';
import { User } from 'src/interfaces/user/user.interface';

import { CreateUserDto } from 'src/dtos/users/create-user.dto';
import { UpdateUserDto } from 'src/dtos/users/update-user.dto';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) { }

    @Post()
    async create(@Body() body: CreateUserDto) {
        try {
            const now = new Date();
            const newUser: User = {
                ...body,
                is_disabled: false,
                photo_url: '',
                google_account_id: '',
                session_id: '',
                created_at: now,
                updated_at: now,
            };

            return this.usersService.create(newUser);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create user',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateUserDto) {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateUser: Partial<User> = {
                ...body,
                updated_at: new Date(),
            };

            return this.usersService.update(id, updateUser);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update user',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const user = await this.usersService.findOne(id);
            if (!user) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'User not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.usersService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete user',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
