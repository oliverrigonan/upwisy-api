import { ApiProperty } from "@nestjs/swagger";

export class CreateFileContentDto {
  @ApiProperty()
  file_id: string;

  @ApiProperty()
  content: string;
}
