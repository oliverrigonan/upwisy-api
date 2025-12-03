export class CreateSessionDto {
  user_id: string;
  enrollment_id: string;
  type: string;
  start_time: string;
  end_time: string;
  duration_seconds: number;
}
