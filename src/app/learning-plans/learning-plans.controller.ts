import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { LearningPlansService } from './learning-plans.service';

import { CreateLearningPlanDto } from './dto/create-learning-plan.dto';
import { UpdateLearningPlanDto } from './dto/update-learning-plan.dto';

@ApiTags('Learning Plans')
@Controller('learning-plans')
export class LearningPlansController {

  constructor(
    private readonly learningPlansService: LearningPlansService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createLearningPlanDto: CreateLearningPlanDto) {
    try {
      return await this.learningPlansService.create(createLearningPlanDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create learning plan',
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
    return await this.learningPlansService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-date/:date')
  async findByDate(@Param('date') date: string) {
    const learningPlans = await this.learningPlansService.findByDate(date);
    if (!learningPlans || learningPlans.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No learning plans found for the specified date',
          error: `No learning plans found with date ${date}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return learningPlans;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-user-id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    const learningPlans = await this.learningPlansService.findByUserId(user_id);
    if (!learningPlans || learningPlans.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No learning plans found for the specified user ID',
          error: `No learning plans found with user ID ${user_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return learningPlans;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const learningPlan = await this.learningPlansService.findOne(id);
    if (!learningPlan) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Learning plan not found',
          error: `The learning plan with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return learningPlan;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateLearningPlanDto: UpdateLearningPlanDto) {
    try {
      const learningPlan = await this.learningPlansService.findOne(id);
      if (!learningPlan) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Learning plan not found',
            error: `The learning plan with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.learningPlansService.update(id, updateLearningPlanDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update learning plan',
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
      const learningPlan = await this.learningPlansService.findOne(id);
      if (!learningPlan) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Learning plan not found',
            error: `The learning plan with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.learningPlansService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove learning plan',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
