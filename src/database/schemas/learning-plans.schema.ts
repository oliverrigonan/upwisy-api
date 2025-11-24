import * as mongoose from 'mongoose';

export const LearningPlansSchema = new mongoose.Schema({
    user_id: String,
    course_id: String,
    date: Date,
    start_time: String,
    end_time: String,
    repetition: String,
    days_of_week: [String],
    ends: String,
    ends_on_date: Date,
    notes: String,
    created_at: Date,
    updated_at: Date,
})