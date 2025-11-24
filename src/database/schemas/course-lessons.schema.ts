import * as mongoose from 'mongoose';

export const CourseLessonsSchema = new mongoose.Schema({
    course_id: String,
    title: String,
    lesson: String,
    status: String,
})