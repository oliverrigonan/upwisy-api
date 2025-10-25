import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { FileContentsService } from './../../services/file-contents/file-contents.service';
import { FileContent } from 'src/interfaces/file-content/file-content.interface';

import { CreateFileContentDto } from 'src/dtos/file-contents/create-file-content.dto';
import { UpdateFileContentDto } from 'src/dtos/file-contents/update-file-content.dto';

@ApiTags('File Contents')
@Controller('api/file-contents')
export class FileContentsController {
    constructor(
        private readonly fileContentsService: FileContentsService
    ) { }

    @Post()
    async create(@Body() body: CreateFileContentDto) {
        try {
            const newFileContent: FileContent = {
                ...body
            };

            return this.fileContentsService.create(newFileContent);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create fileContent',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.fileContentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.fileContentsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateFileContentDto) {
        try {
            const fileContent = await this.fileContentsService.findOne(id);
            if (!fileContent) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'FileContent not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateFileContent: Partial<FileContent> = {
                ...body
            };

            return this.fileContentsService.update(id, updateFileContent);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update fileContent',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const fileContent = await this.fileContentsService.findOne(id);
            if (!fileContent) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'FileContent not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.fileContentsService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete fileContent',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
