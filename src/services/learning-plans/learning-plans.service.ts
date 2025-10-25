import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LearningPlansCollection } from './../../schemas/learning-plans.schema';
import { LearningPlan } from './../../interfaces/learning-plan/learning-plan.interface';

@Injectable()
export class LearningPlansService {
    constructor(
        @InjectModel(LearningPlansCollection.name)
        private readonly learningPlansModel: Model<LearningPlan>,
    ) { }

    async create(data: LearningPlan): Promise<LearningPlan> {
        const now = new Date();
        const newLearningPlan = new this.learningPlansModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newLearningPlan.save();
    }

    async findAll(): Promise<LearningPlan[]> {
        return this.learningPlansModel.find().exec();
    }

    async findOne(id: string): Promise<LearningPlan> {
        const learningPlan = await this.learningPlansModel.findById(id).exec();
        if (!learningPlan) {
            throw new NotFoundException(`Learning Plan with ID ${id} not found`);
        }

        return learningPlan;
    }

    async update(id: string, data: Partial<LearningPlan>): Promise<LearningPlan> {
        data.updated_at = new Date();

        const updatedLearningPlan = await this.learningPlansModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedLearningPlan) {
            throw new NotFoundException(`Learning Plan with ID ${id} not found`);
        }

        return updatedLearningPlan;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.learningPlansModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Learning Plan with ID ${id} not found`);
        }

        return true;
    }
}
