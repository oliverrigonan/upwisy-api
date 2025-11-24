import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { FileContentsService } from './file-contents.service';

import { CreateFileContentDto } from './dto/create-file-content.dto';
import { UpdateFileContentDto } from './dto/update-file-content.dto';

@ApiTags('File Contents')
@Controller('file-contents')
export class FileContentsController {

  constructor(
    private readonly fileContentsService: FileContentsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createFileContentDto: CreateFileContentDto) {
    try {
      return await this.fileContentsService.create(createFileContentDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create file content',
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
    return await this.fileContentsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const fileContent = await this.fileContentsService.findOne(id);
    if (!fileContent) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'File content not found',
          error: `The file content with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return fileContent;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFileContentDto: UpdateFileContentDto) {
    try {
      const fileContent = await this.fileContentsService.findOne(id);
      if (!fileContent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'File content not found',
            error: `The file content with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.fileContentsService.update(id, updateFileContentDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update file content',
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
      const fileContent = await this.fileContentsService.findOne(id);
      if (!fileContent) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'File content not found',
            error: `The file content with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.fileContentsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove file content',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
