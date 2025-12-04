import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonDto {
  @ApiProperty()
  course_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  lesson_number: number;

  @ApiProperty()
  total_lesson_sections: number;

  @ApiProperty()
  status: string;
}
