export class EnrollmentQuizItem {
  enrollment_quiz_id: string;
  quiz_item_id: string;
  user_answer: string | null;
  is_correct: boolean;
  answered_at: Date | null;
}
