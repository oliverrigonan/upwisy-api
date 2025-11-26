import { Controller, Post, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { OpenaiService } from './openai.service';

import { InitializeRealtimeApiSessionConfigDto } from './dto/init-realtime-api-session-config.dto';
import { OfferSDPDto } from './dto/offer-sdp.dto';

@ApiTags('Open AI')
@Controller('api/openai')
export class OpenaiController {

  constructor(
    private readonly openaiService: OpenaiService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("realtime-api/generate-payload")
  generateRealtimeApiPayload() {
    return this.openaiService.generateRealtimeApiPayload();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("realtime-api/create-session")
  async createRealtimeApiSession(@Body() payload: InitializeRealtimeApiSessionConfigDto) {
    try {
      return await this.openaiService.createRealtimeApiSession(payload);
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
  @Post("realtime-api/get-sdp-response")
  async getRealtimeApiSDPResponse(@Body() payload: OfferSDPDto) {
    try {
      return await this.openaiService.getRealtimeApiSDPResponse(payload);
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
