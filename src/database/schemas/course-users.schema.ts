import * as mongoose from 'mongoose';

export const CourseUsersSchema = new mongoose.Schema({
    course_id: String,
    user_id: String,
    status: String,
    enrolled_at: Date,
})