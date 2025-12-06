import * as mongoose from 'mongoose';

const EnrollmentLessonsSchema = new mongoose.Schema({
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enrollments',
    required: true
  },
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lessons',
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

EnrollmentLessonsSchema.virtual('lesson', {
  ref: 'lessons',
  localField: 'lesson_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentLessonsSchema.set('toObject', { virtuals: true });
EnrollmentLessonsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      enrollment_id: ret.enrollment_id,
      lesson_id: ret.lesson_id,
      lesson: (ret as any).lesson,
      total_lesson_sections: ret.total_lesson_sections,
      lesson_sections_completed: ret.lesson_sections_completed,
      status: ret.status,
      completed_at: ret.completed_at,
    };
  },
});

export const EnrollmentLessonsModelProvider = {
  provide: 'ENROLLMENT_LESSONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_lessons', EnrollmentLessonsSchema),
  inject: ['DATABASE_CONNECTION'],
}