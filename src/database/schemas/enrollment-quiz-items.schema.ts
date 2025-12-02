import * as mongoose from 'mongoose';

const EnrollmentQuizItemsSchema = new mongoose.Schema({
  enrollment_quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EnrollmentQuizzes',
    required: true
  },
  quiz_item_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizItems',
    required: true
  },
  user_answer: {
    type: String,
    required: false
  },
  is_correct: {
    type: Boolean,
    required: true
  },
  answered_at: {
    type: Date,
    required: false
  }
});

export const EnrollmentQuizItemsModelProvider = {
  provide: 'ENROLLMENT_QUIZ_ITEMS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_quiz_items', EnrollmentQuizItemsSchema),
  inject: ['DATABASE_CONNECTION'],
}