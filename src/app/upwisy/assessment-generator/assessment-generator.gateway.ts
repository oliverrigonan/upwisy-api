import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Logger, UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateAssessmentForQuizDto } from './dto/generate-assessment.dto';
import { GenerationProgress } from './../interfaces/generation-progress.interface';

import { UsersService } from './../../users/users.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
import { AssessmentsService } from 'src/app/assessments/assessments.service';
import { AssessmentItemsService } from 'src/app/assessment-items/assessment-items.service';

import { CreateAssessmentItemDto } from 'src/app/assessment-items/dto/create-assessment-item.dto';
import { CreateAssessmentDto } from 'src/app/assessments/dto/create-assessment.dto';

@UseGuards(AuthGuard)
@WebSocketGateway(82, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class AssessmentGeneratorGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly usersService: UsersService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    private readonly assessmentsService: AssessmentsService,
    private readonly assessmentItemsService: AssessmentItemsService,
  ) { }

  openai = new OpenAI();
  assessmentItemsStructure = z.array(
    z.object({
      number: z.string(),
      question: z.string(),
      options: z.array(z.object({
        option: z.string(),
        content: z.string(),
      })),
      correct_answer: z.string(),
    })
  );

  matchesClassShape<T extends object>(obj: any, classRef: new () => T): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const instance = new classRef();
    const classKeys = Object.keys(instance);

    for (const key of classKeys) {
      if (!(key in obj)) {
        return false;
      }
    }

    return true;
  }

  @SubscribeMessage('generate-assessment-for-quiz')
  async handleGenerateAssessmentForQuiz(
    @MessageBody() data: GenerateAssessmentForQuizDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const currentUser = socket.data.user;
      const email = currentUser.email;

      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        socket.emit('error', 'User not found for course generation.');
        return;
      }

      if (!data || typeof data !== 'object') {
        socket.emit('error', 'Invalid GenerateAssessmentForQuizDto data received.');
        return;
      }

      try {
        if (!this.matchesClassShape(data, GenerateAssessmentForQuizDto)) {
          socket.emit('error', 'Invalid GenerateAssessmentForQuizDto structure');
          return;
        }
      } catch (validationError) {
        socket.emit('error', validationError.message);
        return;
      }

      const lesson = await this.lessonsService.findOne(data.lesson_id);
      if (!lesson) {
        socket.emit('error', 'Lesson not found for the provided lesson_id.');
        return;
      }

      const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id);
      if (!lessonSections || lessonSections.length === 0) {
        socket.emit('error', 'No lesson sections found for the provided lesson_id.');
        return;
      }

      Logger.log(`Generating assessment items for lesson ID: ${lesson.id} for user ID: ${user.id}`);

      const assessmentItemsInstructions = String.raw`
        You are an expert assessment item generator. Given the lesson title, description, and sections, generate a comprehensive set of at least 10 to 15 assessment items (questions) for a quiz.
        Each assessment item should include a question, multiple-choice options (A, B, C, D), and the correct answer.
        Ensure the questions cover all key topics from the lesson sections and vary in difficulty based on the provided difficulty level: ${data.difficulty}.
        Provide the response in the specified structured format.
      `;

      Logger.log(`${JSON.stringify(lessonSections)}`);

      const assessmentItemsResponse = await this.openai.responses.parse({
        model: "gpt-4o-2024-08-06",
        input: [
          { role: "system", content: assessmentItemsInstructions },
          { role: "user", content: `Lesson Title: ${lesson.title}\nDescription: ${lesson.description}\nLesson Sections: ${JSON.stringify(lessonSections)}` },
        ],
        text: {
          format: zodTextFormat(this.assessmentItemsStructure, "assessmentItems"),
        },
      });

      Logger.log(`Response received from OpenAI for assessment item generation.`, assessmentItemsResponse);

      const assessmentItemsOutput = assessmentItemsResponse.output_parsed;
      if (assessmentItemsOutput) {
        Logger.log(`Generated ${assessmentItemsOutput.length} assessment items for lesson ID: ${lesson.id}`);

        const newAssessment: CreateAssessmentDto = {
          user_id: user.id,
          type: "quiz",
          base_course_id: lesson.course_id,
          base_lesson_id: lesson.id,
          base_file_id: '',
          difficulty: data.difficulty,
          total_items: assessmentItemsOutput.length,
          score: 0,
          comments: '',
          is_submitted: false,
          start_time: new Date().toISOString(),
          end_time: '',
          duration_seconds: 0,
        };
        const createdAssessment = await this.assessmentsService.create(newAssessment);
        if (!createdAssessment) {
          socket.emit('error', 'Failed to create assessment record.');
          return;
        }

        const newAssessmentItems: CreateAssessmentItemDto[] = assessmentItemsOutput.map(item => ({
          assessment_id: createdAssessment.id,
          type: data.type,
          question: item.question,
          options: item.options.map(opt => ({
            option: opt.option,
            content: opt.content
          })) as [{ option: string; content: string; }],
          correct_answer: item.correct_answer,
          user_answer: '',
          percentage_correct: 0,
          is_correct: false,
          answer_explanation: '',
        }));
        const createdAssessmentItems = await this.assessmentItemsService.createMany(newAssessmentItems);
        if (!createdAssessmentItems || createdAssessmentItems.length === 0) {
          socket.emit('error', 'Failed to create assessment item records.');
          return;
        }
      }

      const progress: GenerationProgress = {
        progressPercentage: 100,
        message: 'Assessment generation completed successfully.',
      };
      socket.emit('generate-assessment-progress', progress);
    } catch (error) {
      socket.emit('error', 'An E ' + error.message);
      return;
    }
  }
}
