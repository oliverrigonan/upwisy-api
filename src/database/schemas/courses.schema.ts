import * as mongoose from 'mongoose';

export const CoursesSchema = new mongoose.Schema({
    user_id: String,
    date: Date,
    title: String,
    details: String,
    visibility: String,
    owner_user_id: String,
    status: String,
    created_at: Date,
    updated_at: Date,
})