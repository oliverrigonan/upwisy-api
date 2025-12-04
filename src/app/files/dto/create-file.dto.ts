import { ApiProperty } from "@nestjs/swagger";

export class CreateFileDto {
  @ApiProperty()
  user_id: string;

  @ApiProperty()
  course_id: string;

  @ApiProperty()
  file_url: string;
}
