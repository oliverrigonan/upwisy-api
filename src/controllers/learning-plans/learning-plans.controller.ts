import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LearningPlansService } from './../../services/learning-plans/learning-plans.service';
import { LearningPlan } from 'src/interfaces/learning-plan/learning-plan.interface';

import { CreateLearningPlanDto } from 'src/dtos/learning-plans/create-learning-plan.dto';
import { UpdateLearningPlanDto } from 'src/dtos/learning-plans/update-learning-plan.dto';

@ApiTags('Learning Plans')
@Controller('api/learning-plans')
export class LearningPlansController {
    constructor(
        private readonly learningPlansService: LearningPlansService
    ) { }

    @Post()
    async create(@Body() body: CreateLearningPlanDto) {
        try {
            const now = new Date();
            const newLearningPlan: LearningPlan = {
                ...body,
                created_at: now,
                updated_at: now,
            };

            return this.learningPlansService.create(newLearningPlan);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create learningPlan',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.learningPlansService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.learningPlansService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateLearningPlanDto) {
        try {
            const learningPlan = await this.learningPlansService.findOne(id);
            if (!learningPlan) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'LearningPlan not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateLearningPlan: Partial<LearningPlan> = {
                ...body,
                updated_at: new Date(),
            };

            return this.learningPlansService.update(id, updateLearningPlan);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update learningPlan',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const learningPlan = await this.learningPlansService.findOne(id);
            if (!learningPlan) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'LearningPlan not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.learningPlansService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete learningPlan',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
