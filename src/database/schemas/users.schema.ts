import * as mongoose from 'mongoose';

const UsersSchema = new mongoose.Schema({
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
    enum: ['user', 'student', 'instructor', 'admin'],
    default: 'user',
    required: true
  },
  is_disabled: {
    type: Boolean,
    default: false,
    required: false
  },
  photo_url: {
    type: String,
    required: false
  },
  google_account_id: {
    type: String,
    unique: true,
    required: false
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions',
    required: false
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const UsersModelProvider = {
  provide: 'USERS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('users', UsersSchema),
  inject: ['DATABASE_CONNECTION'],
}