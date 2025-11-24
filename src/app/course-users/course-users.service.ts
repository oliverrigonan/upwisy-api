import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { CourseUser } from './entities/course-user.entity';

import { CreateCourseUserDto } from './dto/create-course-user.dto';
import { UpdateCourseUserDto } from './dto/update-course-user.dto';

@Injectable()
export class CourseUsersService {

  constructor(
    @Inject('COURSE_USERS_MODEL')
    private courseUsersModel: Model<CourseUser>,
  ) { }

  async create(createCourseUserDto: CreateCourseUserDto) {
    const newCourseUser: CourseUser = {
      user_id: createCourseUserDto.user_id,
      course_id: createCourseUserDto.course_id,
      status: createCourseUserDto.status,
      enrolled_at: new Date(createCourseUserDto.enrolled_at),
    };

    const createdCourseUser = new this.courseUsersModel(newCourseUser);
    return await createdCourseUser.save();
  }

  async findAll() {
    return await this.courseUsersModel.find().exec();
  }

  async findByCourseId(course_id: string) {
    return await this.courseUsersModel.find({
      course_id: course_id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.courseUsersModel.findById(id).exec();
  }

  update(id: string, updateCourseUserDto: UpdateCourseUserDto) {
    const updatedCourseUser: Partial<CourseUser> = {
      status: updateCourseUserDto.status,
      enrolled_at: updateCourseUserDto.enrolled_at ? new Date(updateCourseUserDto.enrolled_at) : undefined,
    };

    return this.courseUsersModel.findByIdAndUpdate(id, updatedCourseUser, { new: true }).exec();
  }

  remove(id: string) {
    return this.courseUsersModel.findByIdAndDelete(id).exec();
  }
}
