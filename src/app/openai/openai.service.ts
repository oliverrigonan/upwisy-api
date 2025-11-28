import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import { SessionConfig } from './entities/realtime-api-calls.entity';

import { OfferSDPDto } from './dto/offer-sdp.dto';

@Injectable()
export class OpenaiService {

  constructor(
    private readonly httpService: HttpService
  ) { }

  sessionConfig: SessionConfig = {
    type: "realtime",
    model: "gpt-realtime",
    audio: {
      input: {
        format: {
          type: "audio/pcm",
          rate: 24000
        },
        noise_reduction: {
          type: "near_field",
        },
        transcription: {
          language: "en",
          model: "whisper-1",
        },
        turn_detection: {
          type: "server_vad",
          create_response: true,
          idle_timeout_ms: 30000,
          interrupt_response: true,
          prefix_padding_ms: 300,
          silence_duration_ms: 200,
          threshold: 0.5,
        }
      },
      output: {
        format: {
          type: "audio/pcm",
          rate: 24000
        },
        voice: "marin",
      }
    },
    instructions: "You are Upwisy, an AI Teacher Assistant dedicated to helping users learn effectively.",
    output_modalities: ["audio"],
    tool_choice: "auto",
    tools: [],
  };

  async createRealtimeApiSession(): Promise<string | null> {
    const endpoint = `${process.env.OPENAI_API_BASE_URL}/realtime/client_secrets`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    };
    const payload = JSON.stringify({
      session: this.sessionConfig,
    });

    const response = await firstValueFrom(
      this.httpService.post<any>(endpoint, payload, { headers })
    );

    const data = response.data;

    if (typeof data === 'object' && data !== null && 'value' in data) {
      return data?.value ?? null;
    }

    return null;
  }

  async getRealtimeApiSDPResponse(payload: OfferSDPDto): Promise<RTCSessionDescriptionInit> {
    const endpoint = `${process.env.OPENAI_API_BASE_URL}/realtime/calls`;
    const headers = {
      'Content-Type': 'application/sdp',
      'Authorization': `Bearer ${payload.ephemeralKey}`,
    };

    const response = await firstValueFrom(
      this.httpService.post(
        endpoint,
        payload.sdp,
        { headers, responseType: 'text' }
      )
    );

    return { type: 'answer', sdp: response.data };
  }
}
