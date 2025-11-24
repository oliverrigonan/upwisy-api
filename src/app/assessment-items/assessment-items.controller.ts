import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { AssessmentItemsService } from './assessment-items.service';

import { CreateAssessmentItemDto } from './dto/create-assessment-item.dto';
import { UpdateAssessmentItemDto } from './dto/update-assessment-item.dto';

@ApiTags('Assessment Items')
@Controller('assessment-items')
export class AssessmentItemsController {

  constructor(
    private readonly assessmentItemsService: AssessmentItemsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createAssessmentItemDto: CreateAssessmentItemDto) {
    try {
      return await this.assessmentItemsService.create(createAssessmentItemDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create assessment item',
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
    return await this.assessmentItemsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const assessmentItem = await this.assessmentItemsService.findOne(id);
    if (!assessmentItem) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Assessment item not found',
          error: `The assessment item with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return assessmentItem;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateAssessmentItemDto: UpdateAssessmentItemDto) {
    try {
      const assessmentItem = await this.assessmentItemsService.findOne(id);
      if (!assessmentItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Assessment item not found',
            error: `The assessment item with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.assessmentItemsService.update(id, updateAssessmentItemDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update assessment item',
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
      const assessmentItem = await this.assessmentItemsService.findOne(id);
      if (!assessmentItem) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Assessment item not found',
            error: `The assessment item with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.assessmentItemsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove assessment item',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
