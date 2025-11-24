import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { FileContent } from './entities/file-content.entity';

import { CreateFileContentDto } from './dto/create-file-content.dto';
import { UpdateFileContentDto } from './dto/update-file-content.dto';

@Injectable()
export class FileContentsService {

  constructor(
    @Inject('FILE_CONTENTS_MODEL')
    private fileContentsModel: Model<FileContent>,
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

  async findOne(id: string) {
    return await this.fileContentsModel.findById(id).exec();
  }

  update(id: string, updateFileContentDto: UpdateFileContentDto) {
    const updatedFileContent: Partial<FileContent> = {
      content: updateFileContentDto.content,
    };

    return this.fileContentsModel.findByIdAndUpdate(id, updatedFileContent, { new: true }).exec();
  }

  remove(id: string) {
    return this.fileContentsModel.findByIdAndDelete(id).exec();
  }
}
