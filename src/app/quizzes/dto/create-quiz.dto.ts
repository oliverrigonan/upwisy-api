import { ApiProperty } from "@nestjs/swagger";

export class CreateQuizDto {
  @ApiProperty()
  course_id: string;

  @ApiProperty()
  difficulty: string;

  @ApiProperty()
  total_items: number;

  @ApiProperty()
  status: string;
}
