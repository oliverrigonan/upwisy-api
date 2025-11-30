import * as mongoose from 'mongoose';

export const AssessmentItemsSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessments',
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
  user_answer: {
    type: String,
    required: false
  },
  percentage_correct: {
    type: Number,
    required: true
  },
  is_correct: {
    type: Boolean,
    required: true
  },
  answer_explanation: {
    type: String,
    required: false
  },
});