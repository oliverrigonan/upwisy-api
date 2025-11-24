import * as mongoose from 'mongoose';

export const FileContentsSchema = new mongoose.Schema({
    file_id: String,
    content: String,
})