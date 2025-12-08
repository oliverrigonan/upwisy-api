import { ApiProperty } from "@nestjs/swagger";

export class CreateCourseDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  is_mandatory: boolean;

  @ApiProperty()
  allow_anonymous_users: boolean;

  @ApiProperty()
  material_file_id: string | null;

  @ApiProperty()
  visibility: string;

  @ApiProperty()
  total_lessons: number;

  @ApiProperty()
  total_quizzes: number;
  
  @ApiProperty()
  status: string;
}
