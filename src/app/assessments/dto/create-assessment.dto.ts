export class CreateAssessmentDto {
  user_id: string;
  type: string;
  base_course_id: string;
  base_lesson_id: string;
  base_file_id: string;
  difficulty: string;
  total_items: number;
  score: number;
  comments: string;
  is_submitted: boolean;
  start_time: string;
  end_time: string;
  duration_seconds: number;
}
