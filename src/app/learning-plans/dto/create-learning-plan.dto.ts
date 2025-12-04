import { ApiProperty } from "@nestjs/swagger";

export class CreateLearningPlanDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  enrollment_id: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  start_time: string;

  @ApiProperty()
  end_time: string;

  @ApiProperty()
  repetition: string;

  @ApiProperty()
  days_of_week: [string];

  @ApiProperty()
  ends: string;

  @ApiProperty()
  ends_on_date: string | null;

  @ApiProperty()
  notes: string;
}
