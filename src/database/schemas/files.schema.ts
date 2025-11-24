import * as mongoose from 'mongoose';

export const FilesSchema = new mongoose.Schema({
    user_id: String,
    course_id: String,
    file_url: String,
    created_at: Date,
    updated_at: Date,
})