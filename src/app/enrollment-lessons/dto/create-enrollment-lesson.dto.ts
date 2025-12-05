import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentLessonDto {
  @ApiProperty()
  enrollment_id: string;

  @ApiProperty()
  lesson_id: string;

  @ApiProperty()
  total_lesson_sections: number;

  @ApiProperty()
  lesson_sections_completed: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  completed_at: Date | null;
}
