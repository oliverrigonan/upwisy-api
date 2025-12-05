import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentQuizDto {
  @ApiProperty()
  enrollment_id: string;

  @ApiProperty()
  quiz_id: string;

  @ApiProperty()
  date_taken: Date | null;

  @ApiProperty()
  total_quiz_items: number;

  @ApiProperty()
  score: number;

  @ApiProperty()
  comments: string;

  @ApiProperty()
  is_submitted: boolean;
}
