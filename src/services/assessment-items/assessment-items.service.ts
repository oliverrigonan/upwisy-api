import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AssessmentItemsCollection } from './../../schemas/assessment-items.schema';
import { AssessmentItem } from './../../interfaces/assessment-item/assessment-item.interface';

@Injectable()
export class AssessmentItemsService {
    constructor(
        @InjectModel(AssessmentItemsCollection.name)
        private readonly assessmentItemsModel: Model<AssessmentItem>,
    ) { }

    async create(data: AssessmentItem): Promise<AssessmentItem> {
        const newAssessmentItem = new this.assessmentItemsModel({
            ...data
        });

        return newAssessmentItem.save();
    }

    async findAll(): Promise<AssessmentItem[]> {
        return this.assessmentItemsModel.find().exec();
    }

    async findOne(id: string): Promise<AssessmentItem> {
        const assessmentItem = await this.assessmentItemsModel.findById(id).exec();
        if (!assessmentItem) {
            throw new NotFoundException(`AssessmentItem with ID ${id} not found`);
        }

        return assessmentItem;
    }

    async update(id: string, data: Partial<AssessmentItem>): Promise<AssessmentItem> {
        const updatedAssessmentItem = await this.assessmentItemsModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedAssessmentItem) {
            throw new NotFoundException(`AssessmentItem with ID ${id} not found`);
        }

        return updatedAssessmentItem;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.assessmentItemsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`AssessmentItem with ID ${id} not found`);
        }

        return true;
    }
}
