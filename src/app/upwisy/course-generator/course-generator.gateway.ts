import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateCourseDto, GenerateFullCourseDto, GenerateQuizOnlyCourseDto } from './dto/generate-course.dto';
import { GenerationProgress } from './../interfaces/generation-progress.interface';

import { UsersService, UserDocument } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
import { QuizzesService } from './../../quizzes/quizzes.service';
import { QuizItemsService } from './../../quiz-items/quiz-items.service';
import { FileContentsService } from './../../file-contents/file-contents.service';

import { CreateLessonSectionDto } from './../../lesson-sections/dto/create-lesson-section.dto';

@UseGuards(AuthGuard)
@WebSocketGateway(81, {
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class CourseGeneratorGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly usersService: UsersService,
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    private readonly quizzesService: QuizzesService,
    private readonly quizItemsService: QuizItemsService,
    private readonly fileContentsService: FileContentsService,
  ) { }

  openai = new OpenAI();

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

  async getCurrentUser(socket: Socket): Promise<UserDocument | null> {
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

    return user;
  }

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

  performDataValidation(socket: Socket, data: GenerateCourseDto): void {
    if (!data || typeof data !== 'object') {
      socket.emit('error', 'Invalid data received.');
    }

    if (!this.matchesClassShape(data, GenerateCourseDto)) {
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
      if (data.type.value === "full_course") {
        await this.generateFullCourse(socket, {
          source: data.type.params.source,
          difficulty: data.difficulty
        });
      }

      if (data.type.value === "quiz_only_course") {
        await this.generateQuizOnlyCourse(socket, {
          file_id: data.type.params.file_id,
          difficulty: data.difficulty
        });
      }
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }

  private async generateFullCourse(
    socket: Socket,
    params: GenerateFullCourseDto,
  ) {
    try {
      const currentUser = await this.getCurrentUser(socket);
      if (!currentUser) return;

      let currentProgress = 0;

      switch (params.source.value) {
        case "subject": {
          let generationProgress: GenerationProgress = {
            progress: currentProgress,
            message: 'Starting generation process...',
          };
          socket.emit('generation-progress', generationProgress);

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
            user_id: currentUser.id,
            title: courseOutput.title,
            description: courseOutput.description,
            difficulty: params.difficulty,
            type: 'full_course',
            is_mandatory: false,
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

          const newLessonSections: CreateLessonSectionDto[] = [];
          for (let i = 0; i < createdLessons.length; i++) {
            const lesson = lessonsOutput.lessons.find(l =>
              l.number === createdLessons[i].lesson_number &&
              l.title === createdLessons[i].title &&
              l.description === createdLessons[i].description
            );

            const lessonSections = lesson?.sections || [];
            if (lessonSections.length > 0) {
              for (let j = 0; j < lessonSections.length; j++) {
                const section = lessonSections[j];
                newLessonSections.push({
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

          const createdLessonSections = await this.lessonSectionsService.createMany(newLessonSections);
          if (!createdLessonSections || createdLessonSections.length === 0) {
            socket.emit('error', 'Failed to create lesson section records.');
            return;
          }

          generationProgress = {
            progress: currentProgress,
            message: 'Course and lessons created successfully. Starting content generation...',
          };
          socket.emit('generation-progress', generationProgress);

          let totalItemsProcessed = 0;

          for (let i = 0; i < createdLessons.length; i++) {
            const lesson = createdLessons[i];

            await this.lessonsService.update(lesson.id, {
              status: 'generating',
            });

            let previousSummary = "";

            const lessonSectionsPerLesson = createdLessonSections.filter(section => section.lesson_id.toString() === lesson.id.toString());
            if (lessonSectionsPerLesson.length > 0) {
              for (let j = 0; j < lessonSectionsPerLesson.length; j++) {
                await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                  status: 'generating',
                });

                const lessonSectionInstructions = String.raw`
                  You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
                  The content should be tailored for a ${params.difficulty} difficulty level.
                  Ensure the content is informative, engaging, and covers all topics provided.
                  Additionally, provide a concise summary of the section content for future reference.
                  Provide the response in the specified structured format.
                `;
                const lessonSectionContent = `Lesson Title: ${lesson.title}\nSection Title: ${lessonSectionsPerLesson[j].title}\n\nTopics:\n${lessonSectionsPerLesson[j].topics.join(", ")}\n\nPrevious Summary:\n${previousSummary}`;

                const lessonSectionResponse = await this.generateWithStructure(
                  lessonSectionInstructions,
                  lessonSectionContent,
                  this.lessonSectionSchema,
                  "lesson_sections"
                );

                const lessonSectionOutput = lessonSectionResponse.output_parsed;
                if (lessonSectionOutput) {
                  const updatedLessonSection = await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                    content: lessonSectionOutput.content,
                    summary: lessonSectionOutput.summary,
                    status: 'ready',
                  });

                  previousSummary = updatedLessonSection ? updatedLessonSection.summary : "";
                }

                await this.lessonsService.update(lesson.id, {
                  status: 'ready',
                });

                totalItemsProcessed++;

                currentProgress = (totalItemsProcessed / createdLessonSections.length) * 100;
                generationProgress = {
                  progress: currentProgress,
                  message: 'Generated ' + totalItemsProcessed + ' of ' + createdLessonSections.length,
                };
                socket.emit('generation-progress', generationProgress);
              }
            }
          }

          await this.coursesService.update(createdCourse.id, {
            status: 'ready',
          });

          generationProgress = {
            progress: currentProgress,
            message: 'Generation completed successfully.',
          };
          socket.emit('generation-progress', generationProgress);

          break;
        }

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
            user_id: currentUser.id,
            title: courseOutput.title,
            description: courseOutput.description,
            difficulty: params.difficulty,
            type: 'full_course',
            is_mandatory: false,
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

          let totalItemsProcessed = 0;

          for (let i = 0; i < fileContents.length; i++) {
            const fileContent = fileContents[i];

            const lessonInstructions = String.raw`
              You are an expert course designer. Based on the course title and description provided, create a detailed lesson. 
              The lesson should have a number, title, description, and a list of sections. 
              Each section should include a number, title, and topics covered.
              The lesson should be tailored for a ${params.difficulty} difficulty level.
              Ensure the lesson is well-structured and covers all essential aspects of the subject.
              Provide the response in the specified structured format.
            `;
            const lessonContent = `Course Title: ${courseOutput.title}\nCourse Description: ${courseOutput.description}\n\nFile Content:\n${fileContent.content}`;

            const lessonResponse = await this.generateWithStructure(
              lessonInstructions,
              lessonContent,
              this.lessonSchema,
              "lessons"
            );

            const lessonOutput = lessonResponse.output_parsed;
            if (!lessonOutput) {
              socket.emit('error', 'Failed to parse lessons output.');
              return;
            }

            const createdLesson = await this.lessonsService.create({
              course_id: createdCourse.id,
              title: lessonOutput.title,
              description: lessonOutput.description,
              lesson_number: lessonOutput.number,
              total_lesson_sections: lessonOutput.sections.length,
              status: 'pending',
            });

            if (!createdLesson) {
              socket.emit('error', 'Failed to create lesson record.');
              return;
            }

            const newLessonSections: CreateLessonSectionDto[] = [];
            const lessonSections = lessonOutput?.sections || [];
            if (lessonSections.length > 0) {
              for (let j = 0; j < lessonSections.length; j++) {
                const section = lessonSections[j];
                newLessonSections.push({
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

            const createdLessonSections = await this.lessonSectionsService.createMany(newLessonSections);
            if (!createdLessonSections || createdLessonSections.length === 0) {
              socket.emit('error', 'Failed to create lesson section records.');
              return;
            }

            const lesson = createdLesson;
            await this.lessonsService.update(lesson.id, {
              status: 'generating',
            });

            let previousSummary = "";

            const lessonSectionsPerLesson = createdLessonSections.filter(section => section.lesson_id.toString() === lesson.id.toString());
            if (lessonSectionsPerLesson.length > 0) {
              for (let j = 0; j < lessonSectionsPerLesson.length; j++) {
                await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                  status: 'generating',
                });

                const lessonSectionInstructions = String.raw`
                  You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
                  The content should be tailored for a ${params.difficulty} difficulty level.
                  Ensure the content is informative, engaging, and covers all topics provided.
                  Additionally, provide a concise summary of the section content for future reference.
                  Provide the response in the specified structured format.
                `;
                const lessonSectionContent = `Lesson Title: ${lesson.title}\nSection Title: ${lessonSectionsPerLesson[j].title}\n\nTopics:\n${lessonSectionsPerLesson[j].topics.join(", ")}\n\nPrevious Summary:\n${previousSummary}`;

                const lessonSectionResponse = await this.generateWithStructure(
                  lessonSectionInstructions,
                  lessonSectionContent,
                  this.lessonSectionSchema,
                  "lesson_sections"
                );

                const lessonSectionOutput = lessonSectionResponse.output_parsed;
                if (lessonSectionOutput) {
                  const updatedLessonSection = await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                    content: lessonSectionOutput.content,
                    summary: lessonSectionOutput.summary,
                    status: 'ready',
                  });

                  previousSummary = updatedLessonSection ? updatedLessonSection.summary : "";
                }

                await this.lessonsService.update(lesson.id, {
                  status: 'ready',
                });
              }
            }

            totalItemsProcessed++;

            currentProgress = (totalItemsProcessed / fileContents.length) * 100;
            const generationProgress: GenerationProgress = {
              progress: currentProgress,
              message: 'Generated ' + totalItemsProcessed + ' of ' + fileContents.length,
            };
            socket.emit('generation-progress', generationProgress);
          }

          break;
        }

        default: {
          socket.emit('error', 'Invalid generation source type.');
          break;
        }
      }

      const generationProgress: GenerationProgress = {
        progress: currentProgress,
        message: 'Generation completed successfully.',
      };
      socket.emit('generation-progress', generationProgress);
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }

  private async generateQuizOnlyCourse(
    socket: Socket,
    params: GenerateQuizOnlyCourseDto,
  ) {
    try {
      const currentUser = await this.getCurrentUser(socket);
      if (!currentUser) return;

      let currentProgress = 0;

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
        user_id: currentUser.id,
        title: courseOutput.title,
        description: courseOutput.description,
        difficulty: params.difficulty,
        type: 'quiz_only_course',
        is_mandatory: false,
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

      const createdQuiz = await this.quizzesService.create({
        course_id: createdCourse.id,
        total_items: 0,
        status: 'pending',
      });

      if (!createdQuiz) {
        socket.emit('error', 'Failed to create quiz record.');
        return;
      }

      let totalQuizItems = 0;
      let totalItemsProcessed = 0;

      for (let i = 0; i < fileContents.length; i++) {
        const fileContent = fileContents[i];

        const quizItemsInstructions = String.raw`
          You are an expert quiz creator. Based on the course title and description provided, create a set of at least 5 to 10 quiz items. 
          Each quiz item should have a number, question, multiple options, and the correct answer.
          The quiz items should be tailored for a ${params.difficulty} difficulty level.
          Ensure the quiz items are well-structured and effectively assess knowledge of the subject.
          Provide the response in the specified structured format.
        `;
        const quizItemsContent = `Course Title: ${courseOutput.title}\nCourse Description: ${courseOutput.description}\n\nFile Content:\n${fileContent.content}`;

        const quizItemsResponse = await this.generateWithStructure(
          quizItemsInstructions,
          quizItemsContent,
          this.quizItemsStructure,
          "quiz_items"
        );

        const quizItemsOutput = quizItemsResponse.output_parsed;
        if (!quizItemsOutput) {
          socket.emit('error', 'Failed to parse quiz items output.');
          return;
        }

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

        if (!createdQuizItems || createdQuizItems.length === 0) {
          socket.emit('error', 'Failed to create quiz item records.');
          return;
        }

        totalQuizItems += createdQuizItems.length;
        totalItemsProcessed++;

        currentProgress = (totalItemsProcessed / fileContents.length) * 100;
        const generationProgress: GenerationProgress = {
          progress: currentProgress,
          message: 'Generated ' + totalItemsProcessed + ' of ' + fileContents.length,
        };
        socket.emit('generation-progress', generationProgress);
      }

      await this.quizzesService.update(createdQuiz.id, {
        total_items: totalQuizItems,
        status: 'ready',
      });

      await this.coursesService.update(createdCourse.id, {
        status: 'ready',
      });

      const generationProgress: GenerationProgress = {
        progress: currentProgress,
        message: 'Generation completed successfully.',
      };
      socket.emit('generation-progress', generationProgress);
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }
}
