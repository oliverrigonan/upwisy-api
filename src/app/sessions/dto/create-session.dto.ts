import { ApiProperty } from "@nestjs/swagger";

export class CreateSessionDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  enrollment_id: string;

  @ApiProperty()
  start_time: string | null;

  @ApiProperty()
  end_time: string | null;

  @ApiProperty()
  duration_seconds: number;
}
