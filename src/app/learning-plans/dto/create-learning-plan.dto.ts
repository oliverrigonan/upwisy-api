export class CreateLearningPlanDto {
  user_id: string;
  enrollment_id: string;
  date: string;
  start_time: string;
  end_time: string;
  repetition: string;
  days_of_week: [string];
  ends: string;
  ends_on_date: string | null;
  notes: string;
}
