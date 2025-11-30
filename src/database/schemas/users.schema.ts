import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  hashed_password: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  is_disabled: {
    type: Boolean,
    default: false
  },
  photo_url: { type: String },
  google_account_id: {
    type: String, unique: true
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions',
    required: false
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})
