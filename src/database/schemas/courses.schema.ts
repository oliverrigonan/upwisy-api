import * as mongoose from 'mongoose';

const CoursesSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
    required: true
  },
  type: {
    type: String,
    enum: ['full_course', 'quiz_only_course'],
    default: 'full_course',
    required: true
  },
  is_mandatory: {
    type: Boolean,
    default: false,
    required: true
  },
  material_file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'files',
    default: null,
    required: false
  },
  allow_anonymous_users: {
    type: Boolean,
    default: false,
    required: true
  },
  visibility: {
    type: String,
    enum: ['private', 'public'],
    default: 'private',
    required: true
  },
  total_lessons: {
    type: Number,
    default: 0,
  },
  total_quizzes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready', 'published', 'archived'],
    default: 'pending',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const CoursesModelProvider = {
  provide: 'COURSES_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('courses', CoursesSchema),
  inject: ['DATABASE_CONNECTION'],
}