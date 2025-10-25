import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AssessmentsCollection } from './../../schemas/assessments.schema';
import { Assessment } from './../../interfaces/assessment/assessment.interface';

@Injectable()
export class AssessmentsService {
    constructor(
        @InjectModel(AssessmentsCollection.name)
        private readonly assessmentsModel: Model<Assessment>,
    ) { }

    async create(data: Assessment): Promise<Assessment> {
        const now = new Date();
        const newAssessment = new this.assessmentsModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newAssessment.save();
    }

    async findAll(): Promise<Assessment[]> {
        return this.assessmentsModel.find().exec();
    }

    async findOne(id: string): Promise<Assessment> {
        const assessment = await this.assessmentsModel.findById(id).exec();
        if (!assessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }

        return assessment;
    }

    async update(id: string, data: Partial<Assessment>): Promise<Assessment> {
        data.updated_at = new Date();

        const updatedAssessment = await this.assessmentsModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedAssessment) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }

        return updatedAssessment;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.assessmentsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Assessment with ID ${id} not found`);
        }

        return true;
    }
}
