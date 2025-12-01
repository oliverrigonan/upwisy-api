import * as mongoose from 'mongoose';

const LessonSectionsSchema = new mongoose.Schema({
  lesson_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lessons',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  topics: {
    type: [String],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  section_number: {
    type: Number,
    required: true
  },
  tokens_used: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'ready'],
    default: 'pending',
    required: true
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const LessonSectionsModelProvider = {
  provide: 'LESSON_SECTIONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('lesson_sections', LessonSectionsSchema),
  inject: ['DATABASE_CONNECTION'],
}