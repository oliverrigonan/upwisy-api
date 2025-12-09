import * as mongoose from 'mongoose';

const EnrollmentsSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'courses',
    required: true
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
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
    enum: ['enrolled', 'active', 'completed', 'cancelled'],
    default: 'enrolled',
    required: true
  },
  completed_at: {
    type: Date,
    default: null,
    required: false,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

EnrollmentsSchema.virtual('course', {
  ref: 'courses',
  localField: 'course_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentsSchema.virtual('user', {
  ref: 'users',
  localField: 'user_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentsSchema.virtual('session', {
  ref: 'sessions',
  localField: 'session_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentsSchema.set('toObject', { virtuals: true });
EnrollmentsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      course_id: ret.course_id,
      course: (ret as any).course,
      user_id: ret.user_id,
      user: (ret as any).user,
      enrolled_date: ret.enrolled_date,
      is_anonymous: ret.is_anonymous,
      display_name: ret.display_name,
      session_id: ret.session_id,
      session: ret.session_id ? (ret as any).session || null : null,
      total_lessons: ret.total_lessons,
      lessons_completed: ret.lessons_completed,
      quizzes_taken: ret.quizzes_taken,
      status: ret.status,
      created_at: ret.created_at,
      updated_at: ret.updated_at,
    };
  },
});

export const EnrollmentsModelProvider = {
  provide: 'ENROLLMENTS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollments', EnrollmentsSchema),
  inject: ['DATABASE_CONNECTION'],
}