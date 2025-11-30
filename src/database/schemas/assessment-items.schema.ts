import * as mongoose from 'mongoose';

export const AssessmentItemsSchema = new mongoose.Schema({
  assessment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessments',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: {
    type: Array<{ option: string, content: string }>,
    required: true
  },
  correct_answer: {
    type: String,
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
});