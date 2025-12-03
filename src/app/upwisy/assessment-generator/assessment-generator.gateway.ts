import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
// import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateAssessmentForExamDto, GenerateAssessmentForQuizDto } from './dto/generate-assessment.dto';
// import { GenerationProgress } from './../interfaces/generation-progress.interface';

import { UserDocument, UsersService } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
// import { AssessmentsService } from './../../assessments/assessments.service';
// import { AssessmentItemsService } from './../../assessment-items/assessment-items.service';

// import { LessonSection } from './../../lesson-sections/entities/lesson-section.entity';
// import { Lesson } from './../../lessons/entities/lesson.entity';

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
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    // private readonly assessmentsService: AssessmentsService,
    // private readonly assessmentItemsService: AssessmentItemsService,
  ) { }

  openai = new OpenAI();
  assessmentItemsStructure = z.object({
    assessmentItems: z.array(
      z.object({
        number: z.string(),
        question: z.string(),
        options: z.array(z.object({
          option: z.string(),
          content: z.string(),
        })),
        correct_answer: z.string(),
      })
    )
  });

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

  private async performValidation(
    data: GenerateAssessmentForQuizDto | GenerateAssessmentForExamDto,
    dataDtoClass: new () => GenerateAssessmentForQuizDto | GenerateAssessmentForExamDto,
    socket: Socket,
  ): Promise<{ user: UserDocument } | null> {
    const currentUser = socket.data.user;
    if (!currentUser?.email) {
      socket.emit('error', 'User email not found.');
      return null;
    }

    const user = await this.usersService.findOneByEmail(currentUser.email);
    if (!user) {
      socket.emit('error', 'User not found.');
      return null;
    }

    if (!data || typeof data !== 'object') {
      socket.emit('error', 'Invalid data received.');
      return null;
    }

    if (!this.matchesClassShape(data, dataDtoClass)) {
      socket.emit('error', `Invalid ${dataDtoClass.name} structure.`);
      return null;
    }

    return { user };
  }

  @SubscribeMessage('generate-assessment-for-quiz')
  async handleGenerateAssessmentForQuiz(
    @MessageBody() data: GenerateAssessmentForQuizDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const validation = await this.performValidation(data, GenerateAssessmentForQuizDto, socket);
      if (!validation) return;

      // const { user } = validation;

      // let progress = 0;
      // let itemsProcessed = 0;
      // let itemsTotal = 0;

      // const lesson = await this.lessonsService.findOne(data.lesson_id);
      // if (!lesson) {
      //   socket.emit('error', 'Lesson not found for the provided lesson_id.');
      //   return;
      // }

      // const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id);
      // if (!lessonSections || lessonSections.length === 0) {
      //   socket.emit('error', 'No lesson sections found for the provided lesson_id.');
      //   return;
      // }

      // itemsTotal = lessonSections.length;

      // const createdAssessment = await this.assessmentsService.create({
      //   user_id: user.id,
      //   type: "quiz",
      //   base_course_id: lesson.course_id,
      //   base_lesson_id: lesson.id,
      //   base_file_id: null,
      //   difficulty: data.difficulty,
      //   total_items: 0,
      //   score: 0,
      //   comments: '-',
      //   is_submitted: false,
      //   start_time: new Date().toISOString(),
      //   end_time: null,
      //   duration_seconds: 0,
      // });

      // if (!createdAssessment) {
      //   socket.emit('error', 'Failed to create assessment record.');
      //   return;
      // }

      // for (let i = 0; i < lessonSections.length; i++) {
      //   const assessmentItemsInstructions = data.type === 'multiple_choice'
      //     ? String.raw`
      //       You are an expert educational content creator. Based on the provided lesson title, description, and lesson section, generate a set of 5 multiple-choice questions (MCQs) suitable for a quiz assessment. 
      //       Each question should have 4 options labeled A, B, C, and D, with one correct answer clearly indicated.
      //       Ensure that the questions are relevant to the lesson section content and vary in difficulty (easy, medium, hard) according to the specified difficulty level: ${data.difficulty}.
      //       Provide the response in the specified structured format.
      //     `
      //     : String.raw`
      //       You are an expert educational content creator. Based on the provided lesson title, description, and lesson section, generate a set of 5 questions suitable for a quiz assessment. 
      //       The question type is: ${data.type}.
      //       Each question should have a correct answer clearly indicated. Do not provide options for non-multiple-choice questions.
      //       Ensure that the questions are relevant to the lesson section content and vary in difficulty (easy, medium, hard) according to the specified difficulty level: ${data.difficulty}.
      //       Provide the response in the specified structured format, leaving the options field empty for non-multiple-choice questions.
      //     `;

      //   const assessmentItemsResponse = await this.openai.responses.parse({
      //     model: "gpt-4o-2024-08-06",
      //     input: [
      //       { role: "system", content: assessmentItemsInstructions },
      //       { role: "user", content: `Lesson Title: ${lesson.title}\nDescription: ${lesson.description}\nLesson Section: ${JSON.stringify(lessonSections[i])}` },
      //     ],
      //     text: {
      //       format: zodTextFormat(this.assessmentItemsStructure, "assessment_items"),
      //     },
      //   });

      //   const assessmentItemsOutput = assessmentItemsResponse.output_parsed;
      //   if (!assessmentItemsOutput) {
      //     socket.emit('error', 'Failed to parse assessment items from AI response.');
      //     return;
      //   }

      //   const createdAssessmentItems = await this.assessmentItemsService.createMany(
      //     assessmentItemsOutput.assessmentItems.map(item => ({
      //       assessment_id: createdAssessment.id,
      //       type: data.type,
      //       question: item.question,
      //       options: item.options.map(opt => ({
      //         option: opt.option,
      //         content: opt.content
      //       })) as [{ option: string; content: string; }],
      //       correct_answer: item.correct_answer,
      //       user_answer: '',
      //       percentage_correct: 0,
      //       is_correct: false,
      //       answer_explanation: '',
      //     }))
      //   );

      //   if (!createdAssessmentItems || createdAssessmentItems.length === 0) {
      //     socket.emit('error', 'Failed to create assessment item records.');
      //     return;
      //   }

      //   itemsProcessed++;

      //   progress = (itemsProcessed / itemsTotal) * 100;
      //   const generationProgress: GenerationProgress = {
      //     progress: progress,
      //     message: 'Generated ' + itemsProcessed + ' of ' + itemsTotal,
      //   };
      //   socket.emit('generation-progress', generationProgress);
      // }

      // const generationProgress: GenerationProgress = {
      //   progress: progress,
      //   message: 'Generation completed successfully.',
      // };
      // socket.emit('generation-progress', generationProgress);
    } catch (error) {
      socket.emit('error', 'An error occurred during assessment generation: ' + error.message);
      return;
    }
  }

  @SubscribeMessage('generate-assessment-for-exam')
  async handleGenerateAssessmentForExam(
    @MessageBody() data: GenerateAssessmentForExamDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const validation = await this.performValidation(data, GenerateAssessmentForExamDto, socket);
      if (!validation) return;

      // const { user } = validation;

      // let progress = 0;
      // let itemsProcessed = 0;
      // let itemsTotal = 0;

      // const course = await this.coursesService.findOne(data.course_id);
      // if (!course) {
      //   socket.emit('error', 'Course not found for the provided course_id.');
      //   return;
      // }

      // const lessons = await this.lessonsService.findByCourseId(data.course_id);
      // if (!lessons || lessons.length === 0) {
      //   socket.emit('error', 'No lessons found for the provided course_id.');
      //   return;
      // }

      // const lessonSectionsData: { lesson: Lesson; section: LessonSection }[] = [];

      // for (let i = 0; i < lessons.length; i++) {
      //   const lesson = lessons[i];

      //   const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id);
      //   if (!lessonSections || lessonSections.length === 0) {
      //     socket.emit('error', 'No lesson sections found for the provided lesson_id.');
      //     return;
      //   }

      //   for (const section of lessonSections) {
      //     lessonSectionsData.push({ lesson, section });
      //   }
      // }

      // itemsTotal = lessonSectionsData.length;

      // const createdAssessment = await this.assessmentsService.create({
      //   user_id: user.id,
      //   type: "quiz",
      //   base_course_id: course.id,
      //   base_lesson_id: null,
      //   base_file_id: null,
      //   difficulty: data.difficulty,
      //   total_items: 0,
      //   score: 0,
      //   comments: '-',
      //   is_submitted: false,
      //   start_time: new Date().toISOString(),
      //   end_time: null,
      //   duration_seconds: 0,
      // });

      // if (!createdAssessment) {
      //   socket.emit('error', 'Failed to create assessment record.');
      //   return;
      // }

      // for (let i = 0; i < lessonSectionsData.length; i++) {
      //   const lesson = lessonSectionsData[i].lesson;
      //   const assessmentItemsInstructions = data.type === 'multiple_choice'
      //     ? String.raw`
      //       You are an expert educational content creator. Based on the provided lesson title, description, and lesson section, generate a set of 5 multiple-choice questions (MCQs) suitable for a quiz assessment. 
      //       Each question should have 4 options labeled A, B, C, and D, with one correct answer clearly indicated.
      //       Ensure that the questions are relevant to the lesson section content and vary in difficulty (easy, medium, hard) according to the specified difficulty level: ${data.difficulty}.
      //       Provide the response in the specified structured format.
      //     `
      //     : String.raw`
      //       You are an expert educational content creator. Based on the provided lesson title, description, and lesson section, generate a set of 5 questions suitable for a quiz assessment. 
      //       The question type is: ${data.type}.
      //       Each question should have a correct answer clearly indicated. Do not provide options for non-multiple-choice questions.
      //       Ensure that the questions are relevant to the lesson section content and vary in difficulty (easy, medium, hard) according to the specified difficulty level: ${data.difficulty}.
      //       Provide the response in the specified structured format, leaving the options field empty for non-multiple-choice questions.
      //     `;

      //   const assessmentItemsResponse = await this.openai.responses.parse({
      //     model: "gpt-4o-2024-08-06",
      //     input: [
      //       { role: "system", content: assessmentItemsInstructions },
      //       { role: "user", content: `Lesson Title: ${lesson.title}\nDescription: ${lesson.description}\nLesson Section: ${JSON.stringify(lessonSectionsData[i].section)}` },
      //     ],
      //     text: {
      //       format: zodTextFormat(this.assessmentItemsStructure, "assessment_items"),
      //     },
      //   });

      //   const assessmentItemsOutput = assessmentItemsResponse.output_parsed;
      //   if (!assessmentItemsOutput) {
      //     socket.emit('error', 'Failed to parse assessment items from AI response.');
      //     return;
      //   }

      //   const createdAssessmentItems = await this.assessmentItemsService.createMany(
      //     assessmentItemsOutput.assessmentItems.map(item => ({
      //       assessment_id: createdAssessment.id,
      //       type: data.type,
      //       question: item.question,
      //       options: item.options.map(opt => ({
      //         option: opt.option,
      //         content: opt.content
      //       })) as [{ option: string; content: string; }],
      //       correct_answer: item.correct_answer,
      //       user_answer: '',
      //       percentage_correct: 0,
      //       is_correct: false,
      //       answer_explanation: '',
      //     }))
      //   );

      //   if (!createdAssessmentItems || createdAssessmentItems.length === 0) {
      //     socket.emit('error', 'Failed to create assessment item records.');
      //     return;
      //   }

      //   itemsProcessed++;

      //   progress = (itemsProcessed / itemsTotal) * 100;
      //   const generationProgress: GenerationProgress = {
      //     progress: progress,
      //     message: 'Generated ' + itemsProcessed + ' of ' + itemsTotal,
      //   };
      //   socket.emit('generation-progress', generationProgress);
      // }

      // const generationProgress: GenerationProgress = {
      //   progress: progress,
      //   message: 'Generation completed successfully.',
      // };
      // socket.emit('generation-progress', generationProgress);
    } catch (error) {
      socket.emit('error', 'An error occurred during assessment generation: ' + error.message);
      return;
    }
  }
}
