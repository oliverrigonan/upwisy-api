import * as mongoose from 'mongoose';

export const LessonsSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  lesson_number: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready'],
    default: 'pending',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
