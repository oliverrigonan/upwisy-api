import { ApiProperty } from "@nestjs/swagger";

export class CreateLessonSectionDto {
  @ApiProperty()
  lesson_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  topics: string[];

  @ApiProperty()
  content: string;

  @ApiProperty()
  summary: string;

  @ApiProperty()
  tokens_used: number;

  @ApiProperty()
  status: string;
}
