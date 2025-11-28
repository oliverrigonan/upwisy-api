import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { OpenaiService } from './openai.service';

import { OfferSDPDto } from './dto/offer-sdp.dto';

@ApiTags('Open AI')
@Controller('api/openai')
export class OpenaiController {

  constructor(
    private readonly openaiService: OpenaiService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("realtime/create-session")
  async createRealtimeSession() {
    try {
      return await this.openaiService.createRealtimeSession();
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create session',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("realtime/get-sdp-response")
  async getRealtimeSDPResponse(@Body() payload: OfferSDPDto) {
    try {
      return await this.openaiService.getRealtimeSDPResponse(payload);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to get SDP response',
          error: error,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
