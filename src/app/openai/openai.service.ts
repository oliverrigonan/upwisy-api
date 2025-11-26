import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import FormData from 'form-data';

import { InitializeRealtimeApiSessionConfigDto } from './dto/init-realtime-api-session-config.dto';
import { OfferSDPDto } from './dto/offer-sdp.dto';

@Injectable()
export class OpenaiService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  generateRealtimeApiPayload(): InitializeRealtimeApiSessionConfigDto {
    const payload: InitializeRealtimeApiSessionConfigDto = {
      model: "gpt-4o-realtime-preview",
      voice: "alloy",
      modalities: ["audio", "text"],
      instructions: "You are Upwisy, an AI Teacher Assistant dedicated to helping users learn effectively.",
      input_audio_format: "pcm16",
      output_audio_format: "pcm16",
      tools: [],
      turn_detection: {
        type: "server_vad",
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 200,
        create_response: true,
        interrupt_response: true
      },
    }

    return payload;
  }

  async createRealtimeApiSession(payload: InitializeRealtimeApiSessionConfigDto): Promise<string | null> {
    const endpoint = `${process.env.OPENAI_API_BASE_URL}/realtime/sessions`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };

    const response = await firstValueFrom(
      this.httpService.post<any>(endpoint, payload, { headers })
    );

    const data = response.data;

    if (typeof data === 'object' && data !== null && 'client_secret' in data) {
      return data.client_secret?.value ?? null;
    }

    return null;
  }

  async getRealtimeApiSDPResponse(payload: OfferSDPDto): Promise<RTCSessionDescriptionInit> {
    const endpoint = `${process.env.OPENAI_API_BASE_URL}/realtime`;
    const headers = {
      'Content-Type': 'application/sdp',
      'Authorization': `Bearer ${payload.ephemeralKey}`,
    };

    const response = await firstValueFrom(
      this.httpService.post(endpoint, payload.sdp, { headers, responseType: 'text' }),
    );

    return { type: 'answer', sdp: response.data };
  }
}
