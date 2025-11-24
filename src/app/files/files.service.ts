import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { File } from './entities/file.entity';

import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FilesService {

  constructor(
    @Inject('FILES_MODEL')
    private filesModel: Model<File>,
  ) { }

  async create(createFileDto: CreateFileDto) {
    const newFile: File = {
      user_id: createFileDto.user_id,
      course_id: createFileDto.course_id,
      file_url: createFileDto.file_url,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdFile = new this.filesModel(newFile);
    return await createdFile.save();
  }

  async findAll() {
    return await this.filesModel.find().exec();
  }

  async findOne(id: string) {
    return await this.filesModel.findById(id).exec();
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    const updatedFile: Partial<File> = {
      user_id: updateFileDto.user_id,
      course_id: updateFileDto.course_id,
      file_url: updateFileDto.file_url,
      updated_at: new Date(),
    };

    return this.filesModel.findByIdAndUpdate(id, updatedFile, { new: true }).exec();
  }

  remove(id: string) {
    return this.filesModel.findByIdAndDelete(id).exec();
  }
}
