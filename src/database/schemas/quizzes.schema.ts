import * as mongoose from 'mongoose';

const QuizzesSchema = new mongoose.Schema({
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: false
  },
  total_items: {
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

export const QuizzesModelProvider = {
  provide: 'QUIZZES_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('quizzes', QuizzesSchema),
  inject: ['DATABASE_CONNECTION'],
}