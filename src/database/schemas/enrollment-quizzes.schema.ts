import * as mongoose from 'mongoose';

const EnrollmentQuizzesSchema = new mongoose.Schema({
  enrollment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Enrollments',
    required: true
  },
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quizzes',
    required: true
  },
  date_taken: {
    type: Date,
    default: Date.now,
    required: true
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

export const EnrollmentQuizzesModelProvider = {
  provide: 'ENROLLMENT_QUIZZES_MODEL',
  useFactory: (mongoose: mongoose.Mongoose) => mongoose.model('enrollment_quizzes', EnrollmentQuizzesSchema),
  inject: ['DATABASE_CONNECTION'],
}