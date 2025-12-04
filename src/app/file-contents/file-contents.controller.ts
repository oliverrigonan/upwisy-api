import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { FileContentsService } from './file-contents.service';

@ApiTags('File Contents')
@Controller('api/file-contents')
export class FileContentsController {

  constructor(
    private readonly fileContentsService: FileContentsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.fileContentsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-file-id/:file_id')
  async findByFileId(@Param('file_id') file_id: string) {
    const fileContents = await this.fileContentsService.findByFileId(file_id);
    return fileContents;
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
}
