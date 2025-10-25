import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FilesService } from './../../services/files/files.service';
import { File } from 'src/interfaces/file/file.interface';

import { CreateFileDto } from 'src/dtos/files/create-file.dto';
import { UpdateFileDto } from 'src/dtos/files/update-file.dto';

@ApiTags('Files')
@Controller('api/files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService
    ) { }

    @Post()
    async create(@Body() body: CreateFileDto) {
        try {
            const now = new Date();
            const newFile: File = {
                ...body,
                created_at: now,
                updated_at: now,
            };

            return this.filesService.create(newFile);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create file',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.filesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.filesService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateFileDto) {
        try {
            const file = await this.filesService.findOne(id);
            if (!file) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'File not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateFile: Partial<File> = {
                ...body,
                updated_at: new Date(),
            };

            return this.filesService.update(id, updateFile);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update file',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const file = await this.filesService.findOne(id);
            if (!file) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'File not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.filesService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete file',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
