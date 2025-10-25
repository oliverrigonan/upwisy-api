import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CourseLessonsCollection } from './../../schemas/course-lessons.schema';
import { CourseLesson } from './../../interfaces/course-lesson/course-lesson.interface';

@Injectable()
export class CourseLessonsService {
    constructor(
        @InjectModel(CourseLessonsCollection.name)
        private readonly courseLessonsModel: Model<CourseLesson>,
    ) { }

    async create(data: CourseLesson): Promise<CourseLesson> {
        const newCourseLesson = new this.courseLessonsModel({
            ...data
        });

        return newCourseLesson.save();
    }

    async findAll(): Promise<CourseLesson[]> {
        return this.courseLessonsModel.find().exec();
    }

    async findOne(id: string): Promise<CourseLesson> {
        const courseLesson = await this.courseLessonsModel.findById(id).exec();
        if (!courseLesson) {
            throw new NotFoundException(`CourseLesson with ID ${id} not found`);
        }

        return courseLesson;
    }

    async update(id: string, data: Partial<CourseLesson>): Promise<CourseLesson> {
        const updatedCourseLesson = await this.courseLessonsModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedCourseLesson) {
            throw new NotFoundException(`CourseLesson with ID ${id} not found`);
        }

        return updatedCourseLesson;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.courseLessonsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`CourseLesson with ID ${id} not found`);
        }

        return true;
    }
}
