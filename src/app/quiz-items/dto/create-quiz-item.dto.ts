import { ApiProperty } from "@nestjs/swagger";

export class CreateQuizItemDto {
  @ApiProperty()
  quiz_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  question: string;

  @ApiProperty()
  options: { option: string; content: string }[];

  @ApiProperty()
  correct_answer: string;

  @ApiProperty()
  answer_explanation: string;
}
