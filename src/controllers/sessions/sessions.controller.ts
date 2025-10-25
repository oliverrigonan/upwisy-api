import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SessionsService } from './../../services/sessions/sessions.service';
import { Session } from 'src/interfaces/session/session.interface';

import { CreateSessionDto } from 'src/dtos/sessions/create-session.dto';
import { UpdateSessionDto } from 'src/dtos/sessions/update-session.dto';

@ApiTags('Sessions')
@Controller('api/sessions')
export class SessionsController {
    constructor(
        private readonly sessionsService: SessionsService
    ) { }

    @Post()
    async create(@Body() body: CreateSessionDto) {
        try {
            const now = new Date();
            const newSession: Session = {
                ...body,
                created_at: now,
                updated_at: now,
            };

            return this.sessionsService.create(newSession);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create session',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.sessionsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.sessionsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateSessionDto) {
        try {
            const session = await this.sessionsService.findOne(id);
            if (!session) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Session not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateSession: Partial<Session> = {
                ...body,
                updated_at: new Date(),
            };

            return this.sessionsService.update(id, updateSession);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update session',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const session = await this.sessionsService.findOne(id);
            if (!session) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Session not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.sessionsService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete session',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
