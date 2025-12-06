import * as mongoose from 'mongoose';

const EnrollmentQuizItemsSchema = new mongoose.Schema({
  enrollment_quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'enrollment_quizzes',
    required: true
  },
  quiz_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'quiz_items',
    required: true
  },
  user_answer: {
    type: String,
    default: null,
    required: false
  },
  is_correct: {
    type: Boolean,
    required: true
  },
  answered_at: {
    type: Date,
    default: null,
    required: false
  }
});

EnrollmentQuizItemsSchema.virtual('quiz_item', {
  ref: 'quiz_items',
  localField: 'quiz_item_id',
  foreignField: '_id',
  justOne: true,
});

EnrollmentQuizItemsSchema.set('toObject', { virtuals: true });
EnrollmentQuizItemsSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    return {
      _id: ret._id,
      enrollment_quiz_id: ret.enrollment_quiz_id,
      quiz_item_id: ret.quiz_item_id,
      quiz_item: (ret as any).quiz_item,
      user_answer: ret.user_answer,
      is_correct: ret.is_correct,
      answered_at: ret.answered_at,
    };
  },
});

export const EnrollmentQuizItemsModelProvider = {
  provide: 'ENROLLMENT_QUIZ_ITEMS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_quiz_items', EnrollmentQuizItemsSchema),
  inject: ['DATABASE_CONNECTION'],
}