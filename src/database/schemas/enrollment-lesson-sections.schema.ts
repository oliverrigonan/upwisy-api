import * as mongoose from 'mongoose';

const EnrollmentLessonSectionsSchema = new mongoose.Schema({
  enrollment_lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enrollment_essons',
    required: true
  },
  lesson_section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lesson_sections',
    required: false
  },
  status: {
    type: String,
    enum: ['not_started', 'in_progress', 'completed'],
    default: 'not_started',
    required: true
  },
  started_at: {
    type: Date,
    default: null,
    required: false
  },
  completed_at: {
    type: Date,
    default: null,
    required: false
  }
});

EnrollmentLessonSectionsSchema.virtual('lesson_section', {
  ref: 'lesson_sections',
  localField: 'lesson_section_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentLessonSectionsSchema.set('toObject', { virtuals: true });
EnrollmentLessonSectionsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      enrollment_lesson_id: ret.enrollment_lesson_id,
      lesson_section_id: ret.lesson_section_id,
      lesson_section: (ret as any).lesson_section,
      status: ret.status,
      started_at: ret.started_at,
      completed_at: ret.completed_at,
    };
  },
});

export const EnrollmentLessonSectionsModelProvider = {
  provide: 'ENROLLMENT_LESSON_SECTIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_lesson_sections', EnrollmentLessonSectionsSchema),
  inject: ['DATABASE_CONNECTION'],
}