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
  description: { type: String },
  lesson_number: {
    type: Number,
    required: true
  },
  outline: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready'],
    default: 'pending'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
