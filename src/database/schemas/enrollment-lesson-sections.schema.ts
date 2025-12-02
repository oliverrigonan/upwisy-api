import * as mongoose from 'mongoose';

const EnrollmentLessonSectionsSchema = new mongoose.Schema({
  enrollment_lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnrollmentLessons',
    required: true
  },
  lesson_section_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LessonSections',
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
    required: false
  },
  completed_at: {
    type: Date,
    required: false
  }
});

export const EnrollmentLessonSectionsModelProvider = {
  provide: 'ENROLLMENT_LESSON_SECTIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_lesson_sections', EnrollmentLessonSectionsSchema),
  inject: ['DATABASE_CONNECTION'],
}