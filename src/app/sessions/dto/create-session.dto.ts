export class CreateSessionDto {
  user_id: string;
  course_id: string;
  lesson_id: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
}
