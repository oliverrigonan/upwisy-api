import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  full_name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  hashed_password: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  is_disabled: boolean;

  @ApiProperty()
  photo_url: string;

  @ApiProperty()
  google_account_id: string;

  @ApiProperty()
  session_id: string | null;
}
