import { ApiProperty } from "@nestjs/swagger";

export class CreateEnrollmentQuizItemDto {
  @ApiProperty()
  enrollment_quiz_id: string;

  @ApiProperty()
  quiz_item_id: string;

  @ApiProperty()
  user_answer: string;

  @ApiProperty()
  is_correct: boolean;

  @ApiProperty()
  answered_at: Date;
}
