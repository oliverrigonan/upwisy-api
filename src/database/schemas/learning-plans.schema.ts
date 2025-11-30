import * as mongoose from 'mongoose';

export const LearningPlansSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  resource_course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: false
  },
  resource_lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: false
  },
  resource_assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessments',
    required: false
  },
  date: {
    type: Date,
    default: Date.now,
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
  repetition: {
    type: String,
    enum: ['none', 'daily', 'weekly', 'monthly'],
    default: 'none',
    required: true
  },
  days_of_week: {
    type: [String],
    enum: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    default: [],
    required: false
  },
  ends: {
    type: String,
    enum: ['never', 'on_date', 'after_occurrences'],
    default: 'never',
    required: true
  },
  ends_on_date: {
    type: Date,
    default: Date.now,
    required: false
  },
  notes: {
    type: String,
    required: false
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
})