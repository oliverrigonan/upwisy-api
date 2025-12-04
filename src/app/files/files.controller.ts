import {
  Controller, Get, Post, Param, Delete, HttpException, HttpStatus, UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';

import type { Request } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PDFParse } from 'pdf-parse';

import { AuthGuard } from './../auth/auth.http-guard';

import { FilesService } from './files.service';
import { FileContentsService } from '../file-contents/file-contents.service';

import { CreateFileDto } from './dto/create-file.dto';

@ApiTags('Files')
@Controller('api/files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly fileContentsService: FileContentsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.filesService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-user-id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    const files = await this.filesService.findByUserId(user_id);
    return files;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const file = await this.filesService.findOne(id);
    if (!file) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'File not found',
          error: `The file with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return file;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const file = await this.filesService.findOne(id);
      if (!file) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'File not found',
            error: `The file with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.filesService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove file',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('upload/:course_id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, unique + extname(file.originalname));
        },
      }),
      fileFilter: (req, file, callback) => {
        if (file.mimetype !== 'application/pdf') {
          return callback(new BadRequestException('Only PDF allowed'), false);
        }
        callback(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Param('course_id') course_id: string,
  ) {
    try {
      if (!file) throw new BadRequestException('No file uploaded');

      if (file.mimetype !== 'application/pdf') {
        throw new BadRequestException('Only PDF files are allowed');
      }

      const host = req.protocol + '://' + req.get('host');
      const filePath = `${host}/uploads/${file.filename}`;
      const currentUser = req.user as any;
      const userId = currentUser?.userId;

      const parser = new PDFParse({ url: filePath });
      const pdfData = await parser.getText();
      const pdfText = pdfData.text;

      const words = pdfText.split(/\s+/).filter(word => word.length > 0);
      const chunks: string[] = [];

      for (let i = 0; i < words.length; i += 1000) {
        const chunk = words.slice(i, i + 1000).join(' ');
        chunks.push(chunk);
      }

      const newFile: CreateFileDto = {
        user_id: userId,
        course_id: course_id,
        file_url: filePath,
      };

      const createdFile = await this.filesService.create(newFile);

      await this.fileContentsService.createMany(
        chunks.map(chunk => ({
          file_id: createdFile.id,
          content: chunk,
        })),
      );

      return createdFile;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove file',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
