import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { firstValueFrom } from 'rxjs';

import { LessonsService } from '../lessons/lessons.service';
import { LessonSectionsService } from '../lesson-sections/lesson-sections.service';
import { CoursesService } from '../courses/courses.service';

import { SessionConfig } from './entities/openai-realtime.entity';
import { OfferSDPDto } from './dto/offer-sdp.dto';

@Injectable()
export class OpenaiService {

  constructor(
    private readonly httpService: HttpService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    private readonly coursesService: CoursesService,
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

  async createRealtimeSession(lesson_id: string): Promise<string | null> {
    const lesson = await this.lessonsService.findOne(lesson_id.toString());
    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id.toString());
    if (!lessonSections || lessonSections.length === 0) {
      throw new Error('Lesson sections not found');
    }

    const course = await this.coursesService.findOne(lesson.course_id.toString());
    if (!course) {
      throw new Error('Course not found');
    }

    const instructions = String.raw`
      You are Upwisy, an AI Teacher Assistant dedicated to helping users learn effectively.
      You will assist the user in learning the following course: "${course.title}".
      The current lesson is titled: "${lesson.title}".

      Lesson Description:
      ${lesson.description}

      Lesson Sections:
      ${lessonSections.map((section, index) => `
      Section ${index + 1}: ${section.title}
      Topics: ${section.topics.join(', ')}
      Content: ${section.content}
      Summary: ${section.summary}
      `).join('\n')}

      Use the above information to provide accurate and helpful responses to the user's questions about the lesson.
      Always encourage the user to engage with the material and ask questions if they need further clarification.
      Remember to be patient and supportive, as your goal is to facilitate effective learning.
    `

    this.sessionConfig.instructions = instructions;

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

  async getRealtimeSDPResponse(payload: OfferSDPDto): Promise<RTCSessionDescriptionInit> {
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
