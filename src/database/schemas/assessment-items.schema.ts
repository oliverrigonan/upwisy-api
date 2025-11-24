import * as mongoose from 'mongoose';

export const AssessmentItemsSchema = new mongoose.Schema({
    assessment_id: String,
    question: String,
    options: [{ option: String, content: String }],
    correct_answer: String,
    user_answer: String,
    is_correct: String,
});