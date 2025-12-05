import { ApiProperty } from "@nestjs/swagger";

export class EnrollUserDto {
  @ApiProperty()
  course_id: string;

  @ApiProperty()
  is_anonymous: boolean;

  @ApiProperty()
  display_name: string | null;
}
