import * as mongoose from 'mongoose';

export const CourseSessionsSchema = new mongoose.Schema({
    user_id: String,
    course_id: String,
    course_lesson_id: String,
    start_time: String,
    end_time: String,
    duration_seconds: Number,
    created_at: Date,
    updated_at: Date,
})