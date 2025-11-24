import * as mongoose from 'mongoose';

export const AssessmentsSchema = new mongoose.Schema({
    user_id: String,
    type: String,
    course_id: String,
    course_lesson_id: String,
    difficulty: String,
    total_items: Number,
    score: Number,
    comments: String,
    is_submitted: Boolean,
    start_time: Date,
    end_time: Date,
    duration_seconds: Number,
    created_at: Date,
    updated_at: Date,
})