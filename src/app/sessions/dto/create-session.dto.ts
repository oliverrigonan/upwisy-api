import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  enrollment_id: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  start_time: string;

  @ApiProperty()
  end_time: string;

  @ApiProperty()
  duration_seconds: number;
}
