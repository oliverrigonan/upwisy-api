import * as mongoose from 'mongoose';

export const SessionsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: true
  },
  start_time: {
    type: String,
    required: true
  },
  end_time: {
    type: String,
    required: true
  },
  duration_seconds: {
    type: Number,
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const SessionsModelProvider = {
  provide: 'SESSIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('sessions', SessionsSchema),
  inject: ['DATABASE_CONNECTION'],
}