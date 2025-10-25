import { Controller, Body, Param, Post, Get, Put, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AssessmentItemsService } from './../../services/assessment-items/assessment-items.service';
import { AssessmentItem } from 'src/interfaces/assessment-item/assessment-item.interface';

import { CreateAssessmentItemDto } from 'src/dtos/assessment-items/create-assessment-item.dto';
import { UpdateAssessmentItemDto } from 'src/dtos/assessment-items/update-assessment-item.dto';

@ApiTags('Assessment Items')
@Controller('api/assessment-items')
export class AssessmentItemsController {
    constructor(
        private readonly assessmentItemsService: AssessmentItemsService
    ) { }

    @Post()
    async create(@Body() body: CreateAssessmentItemDto) {
        try {
            const newAssessmentItem: AssessmentItem = {
                ...body
            };

            return this.assessmentItemsService.create(newAssessmentItem);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to create assessmentItem',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Get()
    async findAll() {
        return this.assessmentItemsService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.assessmentItemsService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: UpdateAssessmentItemDto) {
        try {
            const assessmentItem = await this.assessmentItemsService.findOne(id);
            if (!assessmentItem) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'AssessmentItem not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            const updateAssessmentItem: Partial<AssessmentItem> = {
                ...body
            };

            return this.assessmentItemsService.update(id, updateAssessmentItem);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to update assessmentItem',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        try {
            const assessmentItem = await this.assessmentItemsService.findOne(id);
            if (!assessmentItem) {
                throw new HttpException(
                    {
                        statusCode: HttpStatus.NOT_FOUND,
                        message: 'AssessmentItem not found',
                    },
                    HttpStatus.NOT_FOUND,
                );
            }

            return this.assessmentItemsService.delete(id);
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            throw new HttpException(
                {
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                    message: 'Failed to delete assessmentItem',
                    error: error.message || error,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
