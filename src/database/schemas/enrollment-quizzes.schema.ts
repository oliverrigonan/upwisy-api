import * as mongoose from 'mongoose';

const EnrollmentQuizzesSchema = new mongoose.Schema({
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enrollments',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'quizzes',
    required: true
  },
  date_taken: {
    type: Date,
    default: null,
    required: false
  },
  total_quiz_items: {
    type: Number,
    required: true
  },
  score: {
    type: Number,
    required: true
  },
  comments: { type: String },
  is_submitted: {
    type: Boolean,
    default: false
  },
});

EnrollmentQuizzesSchema.virtual('quiz', {
  ref: 'quizzes',
  localField: 'quiz_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentQuizzesSchema.set('toObject', { virtuals: true });
EnrollmentQuizzesSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      enrollment_id: ret.enrollment_id,
      quiz_id: ret.quiz_id,
      quiz: (ret as any).quiz,
      date_taken: ret.date_taken,
      total_quiz_items: ret.total_quiz_items,
      score: ret.score,
      comments: ret.comments,
      is_submitted: ret.is_submitted,
    };
  },
});

export const EnrollmentQuizzesModelProvider = {
  provide: 'ENROLLMENT_QUIZZES_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_quizzes', EnrollmentQuizzesSchema),
  inject: ['DATABASE_CONNECTION'],
}