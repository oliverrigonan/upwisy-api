import * as mongoose from 'mongoose';

const AssessmentsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  type: {
    type: String,
    enum: ['practice', 'quiz', 'assignment', 'exam'],
    required: true
  },
  base_course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: false
  },
  base_lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: false
  },
  base_file_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Files',
    required: false
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
  start_time: {
    type: Date,
    default: Date.now,
    required: true
  },
  end_time: {
    type: Date,
    default: Date.now,
    required: false
  },
  duration_seconds: { type: Number },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const AssessmentsModelProvider = {
  provide: 'ASSESSMENTS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('assessments', AssessmentsSchema),
  inject: ['DATABASE_CONNECTION'],
}