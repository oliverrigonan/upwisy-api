import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { UpwisyService } from './upwisy.service';

import { GenerateCourseFromSubjectDto } from './dto/generate-course-from-subject.dto';

@ApiTags('Upwisy')
@Controller('upwisy')
export class UpwisyController {

  constructor(
    private readonly upwisyService: UpwisyService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("generate-course/from-subject")
  async generateCourseFromSubject(@Body() payload: GenerateCourseFromSubjectDto) {
    try {
      return await this.upwisyService.generateCourseFromSubject(payload.subject);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to generate course from subject',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
