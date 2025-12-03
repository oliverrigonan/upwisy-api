export class CreateEnrollmentQuizDto {
  enrollment_id: string;
  quiz_id: string;
  date_taken: Date;
  total_quiz_items: number;
  score: number;
  comments: string;
  is_submitted: boolean;
}
