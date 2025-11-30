import * as mongoose from 'mongoose';

export const AssessmentsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  type: {
    type: String,
    enum: ['quiz', 'assignment', 'exam'],
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
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard']
  },
  total_items: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  comments: { type: String },
  is_submitted: { type: Boolean, default: false },
  start_time: { type: Date, default: Date.now },
  end_time: { type: Date, default: Date.now },
  duration_seconds: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})