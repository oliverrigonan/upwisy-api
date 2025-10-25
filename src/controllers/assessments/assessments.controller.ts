import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AssessmentsService } from './../../services/assessments/assessments.service';
import { Assessment } from 'src/interfaces/assessment/assessment.interface';

import { CreateAssessmentDto } from 'src/dtos/assessments/create-assessment.dto';
import { UpdateAssessmentDto } from 'src/dtos/assessments/update-assessment.dto';

@ApiTags('Assessments')
@Controller('api/assessments')
export class AssessmentsController {
    constructor(
        private readonly assessmentsService: AssessmentsService
    ) { }

    @Post()
    async create(@Body() body: CreateAssessmentDto) {
        try {
            const now = new Date();
            const newAssessment: Assessment = {
                ...body,
                created_at: now,
                updated_at: now,
            };

            return this.assessmentsService.create(newAssessment);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create assessment',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.assessmentsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.assessmentsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateAssessmentDto) {
        try {
            const assessment = await this.assessmentsService.findOne(id);
            if (!assessment) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Assessment not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateAssessment: Partial<Assessment> = {
                ...body,
                updated_at: new Date(),
            };

            return this.assessmentsService.update(id, updateAssessment);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update assessment',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const assessment = await this.assessmentsService.findOne(id);
            if (!assessment) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'Assessment not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.assessmentsService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete assessment',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
