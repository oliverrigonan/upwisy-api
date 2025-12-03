export class CreateEnrollmentDto {
  course_id: string;
  user_id: string;
  enrolled_date: Date;
  is_anonymous: boolean;
  display_name: string | null;
  session_id: string | null;
  total_lessons: number;
  lessons_completed: number;
  quizzes_taken: number;
  status: string;
}
