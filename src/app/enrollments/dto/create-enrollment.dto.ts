import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentDto {
  @ApiProperty()
  course_id: string;

  @ApiProperty()
  user_id: string;

  @ApiProperty()
  enrolled_date: Date;

  @ApiProperty()
  is_anonymous: boolean;

  @ApiProperty()
  display_name: string | null;

  @ApiProperty()
  session_id: string | null;

  @ApiProperty()
  total_lessons: number;

  @ApiProperty()
  lessons_completed: number;

  @ApiProperty()
  quizzes_taken: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  completed_at: Date | null;
}
