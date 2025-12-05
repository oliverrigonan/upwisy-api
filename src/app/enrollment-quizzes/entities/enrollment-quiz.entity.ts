export class EnrollmentQuiz {
  enrollment_id: string;
  quiz_id: string;
  date_taken: Date | null;
  total_quiz_items: number;
  score: number;
  comments: string;
  is_submitted: boolean;
  created_at: Date;
  updated_at: Date;
}