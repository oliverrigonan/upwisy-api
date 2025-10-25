import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FilesCollection } from './../../schemas/files.schema';
import { File } from './../../interfaces/file/file.interface';

@Injectable()
export class FilesService {
    constructor(
        @InjectModel(FilesCollection.name)
        private readonly filesModel: Model<File>,
    ) { }

    async create(data: File): Promise<File> {
        const now = new Date();
        const newFile = new this.filesModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newFile.save();
    }

    async findAll(): Promise<File[]> {
        return this.filesModel.find().exec();
    }

    async findOne(id: string): Promise<File> {
        const file = await this.filesModel.findById(id).exec();
        if (!file) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }

        return file;
    }

    async update(id: string, data: Partial<File>): Promise<File> {
        data.updated_at = new Date();

        const updatedFile = await this.filesModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedFile) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }

        return updatedFile;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.filesModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`File with ID ${id} not found`);
        }

        return true;
    }
}
