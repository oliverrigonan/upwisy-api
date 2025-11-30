import * as mongoose from 'mongoose';

export const CoursesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: { type: String },
  thumbnail_url: { type: String },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private'
  },
  status: {
    type: String,
    enum: ['draft', 'generating', 'ready'],
    default: 'draft'
  },
  total_lessons: {
    type: Number,
    default: 0
  },
  total_sections: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});
