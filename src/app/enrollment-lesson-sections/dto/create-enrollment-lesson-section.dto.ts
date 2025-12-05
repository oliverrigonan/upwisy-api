import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentLessonSectionDto {
  @ApiProperty()
  enrollment_lesson_id: string;

  @ApiProperty()
  lesson_section_id: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  started_at: Date | null;

  @ApiProperty()
  completed_at: Date | null;
}
