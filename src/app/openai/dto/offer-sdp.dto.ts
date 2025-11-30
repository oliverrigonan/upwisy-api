import { ApiProperty } from "@nestjs/swagger";

export class OfferSDPDto {
  @ApiProperty()
  ephemeralKey: string;

  @ApiProperty()
  sdp: string;
}