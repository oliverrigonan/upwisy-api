import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseUsersCollection } from './../../schemas/course-users.schema';
import { CourseUser } from './../../interfaces/course-user/course-user.interface';

@Injectable()
export class CourseUsersService {
    constructor(
        @InjectModel(CourseUsersCollection.name)
        private readonly courseUsersModel: Model<CourseUser>,
    ) { }

    async create(data: CourseUser): Promise<CourseUser> {
        const now = new Date();
        const newCourseUser = new this.courseUsersModel({
            ...data,
            enrolled_at: now
        });

        return newCourseUser.save();
    }

    async findAll(): Promise<CourseUser[]> {
        return this.courseUsersModel.find().exec();
    }

    async findOne(id: string): Promise<CourseUser> {
        const courseUser = await this.courseUsersModel.findById(id).exec();
        if (!courseUser) {
            throw new NotFoundException(`CourseUser with ID ${id} not found`);
        }

        return courseUser;
    }

    async update(id: string, data: Partial<CourseUser>): Promise<CourseUser> {
        const updatedCourseUser = await this.courseUsersModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedCourseUser) {
            throw new NotFoundException(`CourseUser with ID ${id} not found`);
        }

        return updatedCourseUser;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.courseUsersModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`CourseUser with ID ${id} not found`);
        }

        return true;
    }
}
