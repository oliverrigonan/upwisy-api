import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
    full_name: String,
    email: String,
    username: String,
    hashed_password: String,
    type: String,
    is_disabled: Boolean,
    photo_url: String,
    google_account_id: String,
    session_id: String,
    created_at: Date,
    updated_at: Date,
})
