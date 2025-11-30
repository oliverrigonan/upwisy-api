export class LearningPlan {
  user_id: string;
  resource_course_id: string;
  resource_lesson_id: string;
  resource_assessment_id: string;
  date: Date;
  start_time: string;
  end_time: string;
  repetition: string;
  days_of_week: [string];
  ends: string;
  ends_on_date: Date;
  notes: string;
  created_at: Date;
  updated_at: Date;
}
