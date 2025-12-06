export class Session {
  user_id: string;
  enrollment_id: string;
  start_time: string | null;
  end_time: string | null;
  duration_seconds: number;
  created_at: Date;
  updated_at: Date;
}
