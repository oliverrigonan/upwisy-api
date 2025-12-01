import * as mongoose from 'mongoose';

const LessonsSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
  },
  lesson_number: {
    type: Number,
    required: true
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

export const LessonsModelProvider = {
  provide: 'LESSONS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('lessons', LessonsSchema),
  inject: ['DATABASE_CONNECTION'],
}