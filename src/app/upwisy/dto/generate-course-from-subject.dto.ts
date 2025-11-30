import { ApiProperty } from "@nestjs/swagger";

export class GenerateCourseFromSubjectDto {
  @ApiProperty()
  subject: string;
}