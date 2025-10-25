import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileContentsCollection } from '../../schemas/file-contents.schema';
import { FileContent } from './../../interfaces/file-content/file-content.interface';

@Injectable()
export class FileContentsService {
    constructor(
        @InjectModel(FileContentsCollection.name)
        private readonly fileContentsModel: Model<FileContent>,
    ) { }

    async create(data: FileContent): Promise<FileContent> {
        const newFileContent = new this.fileContentsModel({
            ...data
        });

        return newFileContent.save();
    }

    async findAll(): Promise<FileContent[]> {
        return this.fileContentsModel.find().exec();
    }

    async findOne(id: string): Promise<FileContent> {
        const fileContent = await this.fileContentsModel.findById(id).exec();
        if (!fileContent) {
            throw new NotFoundException(`FileContent with ID ${id} not found`);
        }

        return fileContent;
    }

    async update(id: string, data: Partial<FileContent>): Promise<FileContent> {
        const updatedFileContent = await this.fileContentsModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedFileContent) {
            throw new NotFoundException(`FileContent with ID ${id} not found`);
        }

        return updatedFileContent;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.fileContentsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`FileContent with ID ${id} not found`);
        }

        return true;
    }
}
