import * as mongoose from 'mongoose';

export const LessonSectionsSchema = new mongoose.Schema({
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: true
  },
  section_number: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  tokens_used: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'completed'],
    default: 'pending',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
