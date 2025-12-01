export class Assessment {
  user_id: string;
  type: string;
  base_course_id: string | null;
  base_lesson_id: string | null;
  base_file_id: string | null;
  difficulty: string;
  total_items: number;
  score: number;
  comments: string;
  is_submitted: boolean;
  start_time: Date;
  end_time: Date;
  duration_seconds: number;
  created_at: Date;
  updated_at: Date;
}
