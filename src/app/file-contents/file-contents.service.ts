import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { FileContent } from './entities/file-content.entity';

import { CreateFileContentDto } from './dto/create-file-content.dto';
import { UpdateFileContentDto } from './dto/update-file-content.dto';

export type FileContentDocument = HydratedDocument<FileContent>;

@Injectable()
export class FileContentsService {

  constructor(
    @Inject('FILE_CONTENTS_MODEL')
    private fileContentsModel: Model<FileContentDocument>,
  ) { }

  async create(createFileContentDto: CreateFileContentDto) {
    const newFileContent: FileContent = {
      file_id: createFileContentDto.file_id,
      content: createFileContentDto.content,
    };

    const createdFileContent = new this.fileContentsModel(newFileContent);
    return await createdFileContent.save();
  }

  async findAll() {
    return await this.fileContentsModel.find().exec();
  }

  async findByFileId(file_id: string) {
    return await this.fileContentsModel.find({
      file_id: file_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.fileContentsModel.findById(id).exec();
  }

  update(id: string, updateFileContentDto: UpdateFileContentDto) {
    const updatedFileContent: Partial<FileContent> = {};

    for (const key in updateFileContentDto) {
      if (updateFileContentDto[key] !== undefined) {
        updatedFileContent[key] = updateFileContentDto[key];
      }
    }

    return this.fileContentsModel.findByIdAndUpdate(id, updatedFileContent, { new: true }).exec();
  }

  remove(id: string) {
    return this.fileContentsModel.findByIdAndDelete(id).exec();
  }
}
