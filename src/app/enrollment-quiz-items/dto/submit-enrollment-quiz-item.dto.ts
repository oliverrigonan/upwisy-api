import { ApiProperty } from "@nestjs/swagger";

export class SubmitEnrollmentQuizItemDto {
  @ApiProperty()
  quiz_item_id: string;

  @ApiProperty()
  user_answer: string | null;
}
