import * as mongoose from 'mongoose';

const QuizItemsSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quizzes',
    required: true
  },
  type: {
    type: String,
    enum: ['multiple_choice', 'true_false', 'short_answer', 'essay'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array<{ option: string, content: string }>,
    required: false
  },
  correct_answer: {
    type: String,
    required: true
  },
  answer_explanation: {
    type: String,
    required: false
  },
});

export const QuizItemsModelProvider = {
  provide: 'QUIZ_ITEMS_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('quiz_items', QuizItemsSchema),
  inject: ['DATABASE_CONNECTION'],
}