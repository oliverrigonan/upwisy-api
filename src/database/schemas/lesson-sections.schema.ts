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
  title: { type: String },
  content: {
    type: String,
    required: true
  },
  tokens_used: { type: Number },
  status: {
    type: String,
    enum: ['pending', 'generating', 'complete'],
    default: 'pending'
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
