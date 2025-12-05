import * as mongoose from 'mongoose';

const EnrollmentLessonsSchema = new mongoose.Schema({
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollments',
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: true
  },
  total_lesson_sections: {
    type: Number,
    default: 0,
    required: true
  },
  lesson_sections_completed: {
    type: Number,
    default: 0,
    required: true
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
    required: true
  },
  completed_at: {
    type: Date,
    default: null,
    required: false,
  }
});

export const EnrollmentLessonsModelProvider = {
  provide: 'ENROLLMENT_LESSONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_lessons', EnrollmentLessonsSchema),
  inject: ['DATABASE_CONNECTION'],
}