import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateCourseDto, GenerateFullCourseDto, GenerateQuizOnlyCourseDto } from './dto/generate-course.dto';
import { GenerationComplete, FullCourseGenerationProgress, QuizOnlyCourseGenerationProgress } from './../interfaces/generation-progress.interface';

import { UpwisyService } from '../upwisy.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService, LessonDocument } from './../../lessons/lessons.service';
import { LessonSectionsService, LessonSectionDocument } from './../../lesson-sections/lesson-sections.service';
import { QuizzesService } from './../../quizzes/quizzes.service';
import { QuizItemsService } from './../../quiz-items/quiz-items.service';
import { FileContentsService } from './../../file-contents/file-contents.service';

import { CreateLessonSectionDto } from './../../lesson-sections/dto/create-lesson-section.dto';

@UseGuards(AuthGuard)
@WebSocketGateway({
  namespace: '/upwisy/course-generator',
  transports: ['polling', 'websocket'],
  cors: {
    origin: '*',
  },
})
export class CourseGeneratorGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly upwisyService: UpwisyService,
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    private readonly quizzesService: QuizzesService,
    private readonly quizItemsService: QuizItemsService,
    private readonly fileContentsService: FileContentsService,
  ) { }

  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  courseSchema = z.object({
    title: z.string(),
    description: z.string()
  });
  lessonSchema = z.object({
    number: z.number(),
    title: z.string(),
    description: z.string(),
    sections: z.array(z.object({
      number: z.number(),
      title: z.string(),
      topics: z.array(z.string()),
    })),
  });
  lessonsSchema = z.object({
    lessons: z.array(this.lessonSchema),
  });
  lessonSectionSchema = z.object({
    title: z.string(),
    content: z.string(),
    summary: z.string(),
  });
  quizItemStructure = z.object({
    number: z.string(),
    question: z.string(),
    options: z.array(z.object({
      option: z.string(),
      content: z.string(),
    })),
    correct_answer: z.string(),
  });
  quizItemsStructure = z.object({
    items: z.array(this.quizItemStructure)
  });

  performDataValidation(socket: Socket, data: GenerateCourseDto): void {
    if (!data || typeof data !== 'object') {
      socket.emit('error', 'Invalid data received.');
    }

    if (!this.upwisyService.matchesClassShape(data, GenerateCourseDto)) {
      socket.emit('error', `Invalid ${GenerateCourseDto.name} structure.`);
    }
  }

  private async generateWithStructure<T>(
    instructions: string,
    userContent: string,
    structure: z.ZodType<T>,
    structureName: string
  ) {
    const response = await this.openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: instructions },
        { role: "user", content: userContent },
      ],
      text: {
        format: zodTextFormat(structure, structureName),
      },
    });

    return response;
  }

  @SubscribeMessage('generate-course')
  async handleCourseGeneration(
    @MessageBody() data: GenerateCourseDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const currentUser = await this.upwisyService.getCurrentUser(socket);
      if (!currentUser) return;

      this.performDataValidation(socket, data);

      if (data.type.value === "full_course") {
        await this.generateFullCourse(
          socket,
          {
            source: data.type.params.source,
            difficulty: data.difficulty,
            allow_anonymous_users: data.allow_anonymous_users,
          },
          currentUser.id);
      }

      if (data.type.value === "quiz_only_course") {
        await this.generateQuizOnlyCourse(
          socket,
          {
            file_id: data.type.params.file_id,
            difficulty: data.difficulty,
            allow_anonymous_users: data.allow_anonymous_users,
          },
          currentUser.id
        );
      }
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }

  private async generateFullCourse(
    socket: Socket,
    params: GenerateFullCourseDto,
    userId: string
  ) {
    try {
      const fullCourseGenerationProgress: FullCourseGenerationProgress = {
        course: {
          id: '',
          title: '',
          progress: 0,
          status: '',
        },
        lessons: [],
        quizzes: [],
      };

      fullCourseGenerationProgress.course = {
        id: '',
        title: '',
        progress: 0,
        status: 'generating',
      };
      socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

      switch (params.source.value) {
        case "file": {
          const fileContents = await this.fileContentsService.findByFileId(params.source.file_id);
          if (!fileContents || fileContents.length === 0) {
            socket.emit('error', 'No content found for the provided file.');
            return;
          }

          const firstFileContent = fileContents[0]?.content || "";

          const courseInstructions = String.raw`
            You are an expert course designer. Given the content of the file provided by the user, create a comprehensive course.
            The course should include a detailed title and an in-depth description that covers the scope, objectives, and key learning outcomes.
            Ensure the description is informative and gives a clear overview of what the course will cover.
            Provide the response in the specified structured format.
          `;
          const courseContent = `File Content: ${firstFileContent}`;

          const courseResponse = await this.generateWithStructure(
            courseInstructions,
            courseContent,
            this.courseSchema,
            "course"
          );

          const courseOutput = courseResponse.output_parsed;
          if (!courseOutput) {
            socket.emit('error', 'Failed to parse course output.');
            return;
          }

          const createdCourse = await this.coursesService.create({
            user_id: userId,
            title: courseOutput.title,
            description: courseOutput.description,
            difficulty: params.difficulty,
            type: 'full_course',
            is_mandatory: false,
            allow_anonymous_users: params.allow_anonymous_users,
            material_file_id: params.source.file_id,
            visibility: 'private',
            status: 'pending',
            total_lessons: 0,
            total_quizzes: 0,
          });

          if (!createdCourse) {
            socket.emit('error', 'Failed to create course record.');
            return;
          }

          fullCourseGenerationProgress.course.id = createdCourse.id;
          fullCourseGenerationProgress.course.title = createdCourse.title;
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          let lessonAndSectionsGenerationProgress = 0;
          const lessonAndSectionsGenerationPerFileContent = fileContents.map(async ({ content }) => {
            const lessonInstructions = String.raw`
              You are an expert course designer. Based on the course title and description provided, create a detailed lesson. 
              The lesson should have a number, title, description, and a list of sections. 
              Each section should include a number, title, and topics covered.
              The lesson should be tailored for a ${params.difficulty} difficulty level.
              Ensure the lesson is well-structured and covers all essential aspects of the subject.
              Provide the response in the specified structured format.
            `;
            const lessonContent = `Course Title: ${courseOutput.title}\nCourse Description: ${courseOutput.description}\n\nFile Content:\n${content}`;

            const lessonResponse = await this.generateWithStructure(
              lessonInstructions,
              lessonContent,
              this.lessonSchema,
              "lessons"
            );

            const lessonOutput = lessonResponse.output_parsed;
            if (lessonOutput) {
              const createdLesson = await this.lessonsService.create({
                course_id: createdCourse.id,
                title: lessonOutput.title,
                description: lessonOutput.description,
                lesson_number: lessonOutput.number,
                total_lesson_sections: lessonOutput.sections.length,
                status: 'pending',
              });

              if (createdLesson) {
                await this.lessonsService.update(createdLesson.id, {
                  status: 'generating',
                });

                const generatedLessonSections: CreateLessonSectionDto[] = [];
                const lessonSections = lessonOutput?.sections || [];
                if (lessonSections.length > 0) {
                  for (let j = 0; j < lessonSections.length; j++) {
                    const section = lessonSections[j];
                    generatedLessonSections.push({
                      lesson_id: createdLesson.id,
                      title: section.title,
                      topics: section.topics,
                      content: 'generating...',
                      summary: 'generating...',
                      tokens_used: 0,
                      status: 'pending',
                    });
                  }
                }

                await this.lessonSectionsService.createMany(generatedLessonSections);
              }
            }

            lessonAndSectionsGenerationProgress++;
            fullCourseGenerationProgress.course.progress = (lessonAndSectionsGenerationProgress / fileContents.length) * 100;
            if (fullCourseGenerationProgress.course.progress === 100) {
              fullCourseGenerationProgress.course.status = 'generated';
            }
            socket.emit('full-course-generation-progress', fullCourseGenerationProgress);
          });

          await Promise.all(lessonAndSectionsGenerationPerFileContent);

          const createdLessons = await this.lessonsService.findByCourseId(createdCourse.id);
          if (!createdLessons || createdLessons.length === 0) {
            socket.emit('error', 'Failed to create lesson records.');
            return;
          }

          fullCourseGenerationProgress.lessons = createdLessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            progress: 0,
            status: 'generating',
            lesson_sections: [],
          }));
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const createdLessonSections: LessonSectionDocument[] = [];
          for (let i = 0; i < createdLessons.length; i++) {
            const lessonSections = await this.lessonSectionsService.findByLessonId(createdLessons[i].id);
            createdLessonSections.push(...lessonSections);
          }

          fullCourseGenerationProgress.lessons.map(lesson => {
            const lessonSections = createdLessonSections.filter(
              lessonSection => lessonSection.lesson_id.toString() === lesson.id.toString()
            );

            lesson.lesson_sections = lessonSections.map(lessonSection => ({
              id: lessonSection.id,
              title: lessonSection.title,
              progress: 0,
              status: 'generating',
            }))
          });
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const createdQuiz = await this.quizzesService.create({
            course_id: createdCourse.id,
            total_items: 0,
            status: 'pending',
          });

          if (!createdQuiz) {
            socket.emit('error', 'Failed to create quiz record.');
            return;
          }

          fullCourseGenerationProgress.quizzes[0] = {
            id: createdQuiz.id,
            progress: 0,
            status: 'generating',
            quiz_items: [],
          }
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const allLessonSections: Array<{
            lesson: LessonDocument;
            lessonSection: LessonSectionDocument;
            lessonSectionPreviousSummary: string
          }> = [];

          for (const createdLesson of createdLessons) {
            const lessonSections = await this.lessonSectionsService.findByLessonId(createdLesson.id);

            let previousSummary = "";
            for (const lessonSection of lessonSections) {
              allLessonSections.push({
                lesson: createdLesson,
                lessonSection: lessonSection,
                lessonSectionPreviousSummary: previousSummary
              });
              previousSummary = lessonSection.summary || "";
            }
          }

          let quizItemsGenerationProgress = 0;
          const lessonSectionsAndQuizItemsGeneration = allLessonSections.map(async ({ lesson, lessonSection, lessonSectionPreviousSummary }) => {
            await this.lessonSectionsService.update(lessonSection.id, {
              status: 'generating',
            });

            const lessonSectionInstructions = String.raw`
              You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
              The content should be tailored for a ${params.difficulty} difficulty level.
              Ensure the content is informative, engaging, and covers all topics provided.
              Additionally, provide a concise summary of the section content for future reference.
              Provide the response in the specified structured format.
            `;
            const lessonSectionContent = `Lesson Title: ${lesson.title}\nSection Title: ${lessonSection.title}\n\nTopics:\n${lessonSection.topics.join(", ")}\n\nPrevious Summary:\n${lessonSectionPreviousSummary}`;

            const lessonSectionResponse = await this.generateWithStructure(
              lessonSectionInstructions,
              lessonSectionContent,
              this.lessonSectionSchema,
              "lesson_sections"
            );

            const lessonSectionOutput = lessonSectionResponse.output_parsed;
            if (lessonSectionOutput) {
              await this.lessonSectionsService.update(lessonSection.id, {
                content: lessonSectionOutput.content,
                summary: lessonSectionOutput.summary,
                status: 'ready',
              });

              const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id);

              const notReadyLessonSections = lessonSections.filter(section => section.status !== 'ready');
              if (notReadyLessonSections.length === 0) {
                await this.lessonsService.update(lesson.id, {
                  status: 'ready',
                });
              }

              const progressLesson = fullCourseGenerationProgress.lessons.find(l => l.id.toString() === lesson.id.toString());
              if (progressLesson) {
                const readyLessonSections = lessonSections.filter(section => section.status === 'ready');

                progressLesson.progress = (readyLessonSections.length / lessonSections.length) * 100;
                if (progressLesson.progress === 100) {
                  progressLesson.status = 'generated';
                }

                const progressLessonSection = progressLesson.lesson_sections.find(ls => ls.id.toString() === lessonSection.id.toString());
                if (progressLessonSection) {
                  progressLessonSection.progress = 100;
                  progressLessonSection.status = 'generated';
                }
              }

              socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

              const quizItemsInstructions = String.raw`
                You are an expert quiz creator. Based on the course title and description provided, create a set of at least 5 to 10 quiz items. 
                Each quiz item should have a number, question, multiple options, and the correct answer.
                The quiz items should be tailored for a ${params.difficulty} difficulty level.
                Ensure the quiz items are well-structured and effectively assess knowledge of the subject.
                Provide the response in the specified structured format.
              `;
              const quizItemsContent = `Course Title: ${createdCourse.title}\nCourse Description: ${createdCourse.description}\n\nLesson Title: ${lesson.title}\nLesson Description: ${lesson.description}\n\nLesson Section Title: ${lessonSection.title}\nLesson Section Content:\n${lessonSectionOutput.content}`;

              const quizItemsResponse = await this.generateWithStructure(
                quizItemsInstructions,
                quizItemsContent,
                this.quizItemsStructure,
                "quiz_items"
              );

              const quizItemsOutput = quizItemsResponse.output_parsed;
              if (quizItemsOutput) {
                const createdQuizItems = await this.quizItemsService.createMany(
                  quizItemsOutput.items.map(item => ({
                    quiz_id: createdQuiz.id,
                    type: 'multiple_choice',
                    question: item.question,
                    options: item.options,
                    correct_answer: item.correct_answer,
                    answer_explanation: '',
                    status: 'ready',
                  }))
                );

                if (createdQuizItems && createdQuizItems.length > 0) {
                  fullCourseGenerationProgress.quizzes[0].quiz_items.push(...createdQuizItems.map(quizItem => ({
                    id: quizItem.id,
                    question: quizItem.question,
                    progress: 100,
                    status: 'generated',
                  })));

                  quizItemsGenerationProgress++
                  fullCourseGenerationProgress.quizzes[0].progress = (quizItemsGenerationProgress / allLessonSections.length) * 100;
                  if (fullCourseGenerationProgress.quizzes[0].progress === 100) {
                    fullCourseGenerationProgress.quizzes[0].status = 'generated';
                  }

                  socket.emit('full-course-generation-progress', fullCourseGenerationProgress);
                }
              }
            }
          });

          await Promise.all(lessonSectionsAndQuizItemsGeneration);

          const quizItems = await this.quizItemsService.findByQuizId(createdQuiz.id);
          await this.quizzesService.update(createdQuiz.id, {
            total_items: quizItems.length,
            status: 'ready',
          });

          const lessons = await this.lessonsService.findByCourseId(createdCourse.id);
          const quizzes = await this.quizzesService.findByCourseId(createdCourse.id);

          await this.coursesService.update(createdCourse.id, {
            total_lessons: lessons.length,
            total_quizzes: quizzes.length,
            status: 'ready',
          });

          const generationComplete: GenerationComplete = {
            course_id: createdCourse.id,
          };
          socket.emit('generation-complete', generationComplete);

          break;
        }

        case "subject": {
          const courseInstructions = String.raw`
            You are an expert course designer. Given the subject provided by the user, create a comprehensive course.
            The course should include a detailed title and an in-depth description that covers the scope, objectives, and key learning outcomes.
            Ensure the description is informative and gives a clear overview of what the course will cover.
            Provide the response in the specified structured format.
          `;
          const courseContent = `Subject: ${params.source.subject}`;

          const courseResponse = await this.generateWithStructure(
            courseInstructions,
            courseContent,
            this.courseSchema,
            "course"
          );

          const courseOutput = courseResponse.output_parsed;
          if (!courseOutput) {
            socket.emit('error', 'Failed to parse course output.');
            return;
          }

          const createdCourse = await this.coursesService.create({
            user_id: userId,
            title: courseOutput.title,
            description: courseOutput.description,
            difficulty: params.difficulty,
            type: 'full_course',
            is_mandatory: false,
            allow_anonymous_users: params.allow_anonymous_users,
            material_file_id: null,
            visibility: 'private',
            status: 'pending',
            total_lessons: 0,
            total_quizzes: 0,
          });

          if (!createdCourse) {
            socket.emit('error', 'Failed to create course record.');
            return;
          }

          fullCourseGenerationProgress.course.id = createdCourse.id;
          fullCourseGenerationProgress.course.title = createdCourse.title;
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const lessonsInstructions = String.raw`
            You are an expert course designer. Based on the course title and description provided, create a detailed list of lessons. 
            Each lesson should have a number, title, description, and a list of sections. 
            Each section should include a number, title, and topics covered.
            The lessons should be tailored for a ${params.difficulty} difficulty level.
            Ensure the lessons are well-structured and cover all essential aspects of the subject.
            Provide the response in the specified structured format.
          `;
          const lessonsContent = `Course Title: ${courseOutput.title}\nCourse Description: ${courseOutput.description}`;

          const lessonsResponse = await this.generateWithStructure(
            lessonsInstructions,
            lessonsContent,
            this.lessonsSchema,
            "lessons"
          );

          const lessonsOutput = lessonsResponse.output_parsed;
          if (!lessonsOutput) {
            socket.emit('error', 'Failed to parse lessons output.');
            return;
          }

          const createdLessons = await this.lessonsService.createMany(
            lessonsOutput.lessons.map(lesson => ({
              course_id: createdCourse.id,
              title: lesson.title,
              description: lesson.description,
              lesson_number: lesson.number,
              total_lesson_sections: lesson.sections.length,
              status: 'pending',
            }))
          );

          if (!createdLessons || createdLessons.length === 0) {
            socket.emit('error', 'Failed to create lesson records.');
            return;
          }

          fullCourseGenerationProgress.course.progress = 100;
          fullCourseGenerationProgress.course.status = 'generated';
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          fullCourseGenerationProgress.lessons = createdLessons.map(lesson => ({
            id: lesson.id,
            title: lesson.title,
            progress: 0,
            status: 'generating',
            lesson_sections: [],
          }));
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const generatedLessonSections: CreateLessonSectionDto[] = [];
          for (let i = 0; i < createdLessons.length; i++) {
            const generatedLesson = lessonsOutput.lessons.find(l =>
              l.number === createdLessons[i].lesson_number &&
              l.title === createdLessons[i].title &&
              l.description === createdLessons[i].description
            );

            const lessonSections = generatedLesson?.sections || [];
            if (lessonSections.length > 0) {
              for (let j = 0; j < lessonSections.length; j++) {
                const section = lessonSections[j];
                generatedLessonSections.push({
                  lesson_id: createdLessons[i].id,
                  title: section.title,
                  topics: section.topics,
                  content: 'generating...',
                  summary: 'generating...',
                  tokens_used: 0,
                  status: 'pending',
                });
              }
            }
          }

          const createdLessonSections = await this.lessonSectionsService.createMany(generatedLessonSections);
          if (!createdLessonSections || createdLessonSections.length === 0) {
            socket.emit('error', 'Failed to create lesson section records.');
            return;
          }

          fullCourseGenerationProgress.lessons.map(lesson => {
            const lessonSections = createdLessonSections.filter(
              lessonSection => lessonSection.lesson_id.toString() === lesson.id.toString()
            );

            lesson.lesson_sections = lessonSections.map(lessonSection => ({
              id: lessonSection.id,
              title: lessonSection.title,
              progress: 0,
              status: 'generating',
            }))
          });
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const createdQuiz = await this.quizzesService.create({
            course_id: createdCourse.id,
            total_items: 0,
            status: 'pending',
          });

          if (!createdQuiz) {
            socket.emit('error', 'Failed to create quiz record.');
            return;
          }

          fullCourseGenerationProgress.quizzes[0] = {
            id: createdQuiz.id,
            progress: 0,
            status: 'generating',
            quiz_items: [],
          }
          socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

          const allLessonSections: Array<{
            lesson: LessonDocument;
            lessonSection: LessonSectionDocument;
            lessonSectionPreviousSummary: string
          }> = [];

          for (const createdLesson of createdLessons) {
            const lessonSections = await this.lessonSectionsService.findByLessonId(createdLesson.id);

            let previousSummary = "";
            for (const lessonSection of lessonSections) {
              allLessonSections.push({
                lesson: createdLesson,
                lessonSection: lessonSection,
                lessonSectionPreviousSummary: previousSummary
              });
              previousSummary = lessonSection.summary || "";
            }
          }

          let quizItemsGenerationProgress = 0;
          const lessonSectionsAndQuizItemsGeneration = allLessonSections.map(async ({ lesson, lessonSection, lessonSectionPreviousSummary }) => {
            await this.lessonSectionsService.update(lessonSection.id, {
              status: 'generating',
            });

            const lessonSectionInstructions = String.raw`
              You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
              The content should be tailored for a ${params.difficulty} difficulty level.
              Ensure the content is informative, engaging, and covers all topics provided.
              Additionally, provide a concise summary of the section content for future reference.
              Provide the response in the specified structured format.
            `;
            const lessonSectionContent = `Lesson Title: ${lesson.title}\nSection Title: ${lessonSection.title}\n\nTopics:\n${lessonSection.topics.join(", ")}\n\nPrevious Summary:\n${lessonSectionPreviousSummary}`;

            const lessonSectionResponse = await this.generateWithStructure(
              lessonSectionInstructions,
              lessonSectionContent,
              this.lessonSectionSchema,
              "lesson_sections"
            );

            const lessonSectionOutput = lessonSectionResponse.output_parsed;
            if (lessonSectionOutput) {
              await this.lessonSectionsService.update(lessonSection.id, {
                content: lessonSectionOutput.content,
                summary: lessonSectionOutput.summary,
                status: 'ready',
              });

              const lessonSections = await this.lessonSectionsService.findByLessonId(lesson.id);

              const notReadyLessonSections = lessonSections.filter(section => section.status !== 'ready');
              if (notReadyLessonSections.length === 0) {
                await this.lessonsService.update(lesson.id, {
                  status: 'ready',
                });
              }

              const progressLesson = fullCourseGenerationProgress.lessons.find(l => l.id.toString() === lesson.id.toString());
              if (progressLesson) {
                const readyLessonSections = lessonSections.filter(section => section.status === 'ready');

                progressLesson.progress = (readyLessonSections.length / lessonSections.length) * 100;
                if (progressLesson.progress === 100) {
                  progressLesson.status = 'generated';
                }

                const progressLessonSection = progressLesson.lesson_sections.find(ls => ls.id.toString() === lessonSection.id.toString());
                if (progressLessonSection) {
                  progressLessonSection.progress = 100;
                  progressLessonSection.status = 'generated';
                }
              }

              socket.emit('full-course-generation-progress', fullCourseGenerationProgress);

              const quizItemsInstructions = String.raw`
                You are an expert quiz creator. Based on the course title and description provided, create a set of at least 5 to 10 quiz items. 
                Each quiz item should have a number, question, multiple options, and the correct answer.
                The quiz items should be tailored for a ${params.difficulty} difficulty level.
                Ensure the quiz items are well-structured and effectively assess knowledge of the subject.
                Provide the response in the specified structured format.
              `;
              const quizItemsContent = `Course Title: ${createdCourse.title}\nCourse Description: ${createdCourse.description}\n\nLesson Title: ${lesson.title}\nLesson Description: ${lesson.description}\n\nLesson Section Title: ${lessonSection.title}\nLesson Section Content:\n${lessonSectionOutput.content}`;

              const quizItemsResponse = await this.generateWithStructure(
                quizItemsInstructions,
                quizItemsContent,
                this.quizItemsStructure,
                "quiz_items"
              );

              const quizItemsOutput = quizItemsResponse.output_parsed;
              if (quizItemsOutput) {
                const createdQuizItems = await this.quizItemsService.createMany(
                  quizItemsOutput.items.map(item => ({
                    quiz_id: createdQuiz.id,
                    type: 'multiple_choice',
                    question: item.question,
                    options: item.options,
                    correct_answer: item.correct_answer,
                    answer_explanation: '',
                    status: 'ready',
                  }))
                );

                if (createdQuizItems && createdQuizItems.length > 0) {
                  fullCourseGenerationProgress.quizzes[0].quiz_items.push(...createdQuizItems.map(quizItem => ({
                    id: quizItem.id,
                    question: quizItem.question,
                    progress: 100,
                    status: 'generated',
                  })));

                  quizItemsGenerationProgress++
                  fullCourseGenerationProgress.quizzes[0].progress = (quizItemsGenerationProgress / allLessonSections.length) * 100;
                  if (fullCourseGenerationProgress.quizzes[0].progress === 100) {
                    fullCourseGenerationProgress.quizzes[0].status = 'generated';
                  }

                  socket.emit('full-course-generation-progress', fullCourseGenerationProgress);
                }
              }
            }
          });

          await Promise.all(lessonSectionsAndQuizItemsGeneration);

          const quizItems = await this.quizItemsService.findByQuizId(createdQuiz.id);
          await this.quizzesService.update(createdQuiz.id, {
            total_items: quizItems.length,
            status: 'ready',
          });

          const lessons = await this.lessonsService.findByCourseId(createdCourse.id);
          const quizzes = await this.quizzesService.findByCourseId(createdCourse.id);

          await this.coursesService.update(createdCourse.id, {
            total_lessons: lessons.length,
            total_quizzes: quizzes.length,
            status: 'ready',
          });

          const generationComplete: GenerationComplete = {
            course_id: createdCourse.id,
          };
          socket.emit('generation-complete', generationComplete);

          break;
        }

        default: {
          socket.emit('error', 'Invalid generation source type.');
          break;
        }
      }
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }

  private async generateQuizOnlyCourse(
    socket: Socket,
    params: GenerateQuizOnlyCourseDto,
    userId: string
  ) {
    try {
      const quizOnlyCourseGenerationProgress: QuizOnlyCourseGenerationProgress = {
        course: {
          id: '',
          title: '',
          progress: 0,
          status: 'generating',
        },
        quiz: {
          id: '',
          progress: 0,
          status: 'generating',
          quiz_items: []
        },
      };
      socket.emit('quiz-only-course-generation-progress', quizOnlyCourseGenerationProgress);

      const fileContents = await this.fileContentsService.findByFileId(params.file_id);
      if (!fileContents || fileContents.length === 0) {
        socket.emit('error', 'No content found for the provided file.');
        return;
      }

      const firstFileContent = fileContents[0]?.content || "";

      const courseInstructions = String.raw`
        You are an expert course designer. Given the content of the file provided by the user, create a comprehensive quiz-only course.
        The course should include a detailed title and an in-depth description that covers the scope, objectives, and key learning outcomes.
        This is a quiz-only course, so the description should emphasize assessment and knowledge evaluation.
        Ensure the description is informative and gives a clear overview of what will be assessed.
        Provide the response in the specified structured format.
      `;
      const courseContent = `File Content: ${firstFileContent}`;

      const courseResponse = await this.generateWithStructure(
        courseInstructions,
        courseContent,
        this.courseSchema,
        "course"
      );

      const courseOutput = courseResponse.output_parsed;
      if (!courseOutput) {
        socket.emit('error', 'Failed to parse course output.');
        return;
      }

      const createdCourse = await this.coursesService.create({
        user_id: userId,
        title: courseOutput.title,
        description: courseOutput.description,
        difficulty: params.difficulty,
        type: 'quiz_only_course',
        is_mandatory: false,
        allow_anonymous_users: params.allow_anonymous_users,
        material_file_id: null,
        visibility: 'private',
        status: 'pending',
        total_lessons: 0,
        total_quizzes: 0,
      });

      if (!createdCourse) {
        socket.emit('error', 'Failed to create course record.');
        return;
      }

      quizOnlyCourseGenerationProgress.course = {
        id: createdCourse.id,
        title: createdCourse.title,
        progress: 100,
        status: 'generated',
      };
      socket.emit('quiz-only-course-generation-progress', quizOnlyCourseGenerationProgress);

      const createdQuiz = await this.quizzesService.create({
        course_id: createdCourse.id,
        total_items: 0,
        status: 'pending',
      });

      if (!createdQuiz) {
        socket.emit('error', 'Failed to create quiz record.');
        return;
      }

      quizOnlyCourseGenerationProgress.quiz = {
        id: createdQuiz.id,
        progress: 0,
        status: 'generating',
        quiz_items: [],
      }
      socket.emit('quiz-only-course-generation-progress', quizOnlyCourseGenerationProgress);

      let quizItemsGenerationProgress = 0;
      const quizItemsGenerationPerFileContent = fileContents.map(async ({ content }) => {
        const quizItemsInstructions = String.raw`
          You are an expert quiz creator. Based on the course title and description provided, create a set of at least 5 to 10 quiz items. 
          Each quiz item should have a number, question, multiple options, and the correct answer.
          The quiz items should be tailored for a ${params.difficulty} difficulty level.
          Ensure the quiz items are well-structured and effectively assess knowledge of the subject.
          Provide the response in the specified structured format.
        `;
        const quizItemsContent = `Course Title: ${courseOutput.title}\nCourse Description: ${courseOutput.description}\n\nFile Content:\n${content}`;

        const quizItemsResponse = await this.generateWithStructure(
          quizItemsInstructions,
          quizItemsContent,
          this.quizItemsStructure,
          "quiz_items"
        );

        const quizItemsOutput = quizItemsResponse.output_parsed;
        if (quizItemsOutput) {
          const createdQuizItems = await this.quizItemsService.createMany(
            quizItemsOutput.items.map(item => ({
              quiz_id: createdQuiz.id,
              type: 'multiple_choice',
              question: item.question,
              options: item.options,
              correct_answer: item.correct_answer,
              answer_explanation: '',
              status: 'ready',
            }))
          );

          if (createdQuizItems && createdQuizItems.length > 0) {
            quizOnlyCourseGenerationProgress.quiz.quiz_items.push(...createdQuizItems.map(quizItem => ({
              id: quizItem.id,
              question: quizItem.question,
              progress: 100,
              status: 'generated',
            })));

            quizItemsGenerationProgress++
            quizOnlyCourseGenerationProgress.quiz.progress = (quizItemsGenerationProgress / fileContents.length) * 100;
            if (quizOnlyCourseGenerationProgress.quiz.progress === 100) {
              quizOnlyCourseGenerationProgress.quiz.status = 'generated';
            }

            socket.emit('quiz-only-course-generation-progress', quizOnlyCourseGenerationProgress);
          }
        }
      });

      await Promise.all(quizItemsGenerationPerFileContent);

      const quizItems = await this.quizItemsService.findByQuizId(createdQuiz.id);
      await this.quizzesService.update(createdQuiz.id, {
        total_items: quizItems.length,
        status: 'ready',
      });

      const quizzes = await this.quizzesService.findByCourseId(createdCourse.id);
      await this.coursesService.update(createdCourse.id, {
        total_quizzes: quizzes.length,
        status: 'ready',
      });

      const generationComplete: GenerationComplete = {
        course_id: createdCourse.id,
      };
      socket.emit('generation-complete', generationComplete);
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }
}
