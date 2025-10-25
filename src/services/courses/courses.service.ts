import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CoursesCollection } from './../../schemas/courses.schema';
import { Course } from './../../interfaces/course/course.interface';

@Injectable()
export class CoursesService {
    constructor(
        @InjectModel(CoursesCollection.name)
        private readonly coursesModel: Model<Course>,
    ) { }

    async create(data: Course): Promise<Course> {
        const now = new Date();
        const newCourse = new this.coursesModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newCourse.save();
    }

    async findAll(): Promise<Course[]> {
        return this.coursesModel.find().exec();
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.coursesModel.findById(id).exec();
        if (!course) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return course;
    }

    async update(id: string, data: Partial<Course>): Promise<Course> {
        data.updated_at = new Date();

        const updatedCourse = await this.coursesModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedCourse) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return updatedCourse;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.coursesModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        return true;
    }
}
