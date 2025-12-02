import * as mongoose from 'mongoose';

const EnrollmentsSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  enrolled_date: {
    type: Date,
    default: Date.now,
    required: true
  },
  is_anonymous: {
    type: Boolean,
    default: false,
    required: true
  },
  display_name: {
    type: String,
    required: false
  },
  session_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sessions',
    required: false
  },
  total_lessons: {
    type: Number,
    default: 0,
    required: true
  },
  lessons_completed: {
    type: Number,
    default: 0,
    required: true
  },
  quizzes_taken: {
    type: Number,
    default: 0,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'cancelled'],
    default: 'active',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const EnrollmentsModelProvider = {
  provide: 'ENROLLMENTS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollments', EnrollmentsSchema),
  inject: ['DATABASE_CONNECTION'],
}