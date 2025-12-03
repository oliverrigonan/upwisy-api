export class LearningPlan {
  user_id: string;
  enrollment_id: string;
  date: Date;
  start_time: string;
  end_time: string;
  repetition: string;
  days_of_week: [string];
  ends: string;
  ends_on_date: Date | null;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
