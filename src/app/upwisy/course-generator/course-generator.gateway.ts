import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateCourseDto, GenerationCourseDifficulty, GenerationSource } from './dto/generate-course.dto';
import { GenerationProgress } from './../interfaces/generation-progress.interface';

import { UsersService, UserDocument } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';
import { FilesService } from './../../files/files.service';
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
    private readonly fileService: FilesService,
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
        await this.generateFullCourse(
          socket,
          data.source,
          data.course_difficulty
        );
      }

      if (data.type.value === "quiz_only") {
        /// TODO: Implement generateCourseWithQuizzesFromSubject
      }
    } catch (error) {
      socket.emit('error', 'An Error Occurred: ' + error.message);
      return;
    }
  }

  private async generateFullCourse(
    socket: Socket,
    source: GenerationSource,
    course_difficulty: GenerationCourseDifficulty,
  ) {
    try {
      const currentUser = await this.getCurrentUser(socket);
      if (!currentUser) return;

      let currentProgress = 0;

      switch (source.value) {
        case "subject": {
          const courseInstructions = String.raw`
            You are an expert course designer. Given the subject provided by the user, create a comprehensive course outline.
            The course should include a title, description, and a list of lessons. 
            Each lesson should have a number, title, description, and a list of sections. 
            Each section should include a number, title, and topics covered.
            The course should be tailored for a ${course_difficulty} difficulty level.
            Ensure the course is well-structured and covers all essential aspects of the subject.
            Provide the response in the specified structured format.
          `;
          const courseContent = `Subject: ${source.subject}`;

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
            thumbnail_url: '',
            difficulty: course_difficulty,
            visibility: 'private',
            status: 'pending',
            total_lessons: 0,
            total_sections: 0,
          });

          if (!createdCourse) {
            socket.emit('error', 'Failed to create course record.');
            return;
          }

          const lessonsInstructions = String.raw`
            You are an expert course designer. Based on the course title and description provided, create a detailed list of lessons. 
            Each lesson should have a number, title, description, and a list of sections. 
            Each section should include a number, title, and topics covered.
            The lessons should be tailored for a ${course_difficulty} difficulty level.
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
                  section_number: section.number,
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
                const generationProgress: GenerationProgress = {
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

          const generationProgress: GenerationProgress = {
            progress: currentProgress,
            message: 'Generation completed successfully.',
          };
          socket.emit('generation-progress', generationProgress);

          break;
        }

        case "file": {
          const fileContents = await this.fileContentsService.findByFileId(source.file_id);
          if (!fileContents || fileContents.length === 0) {
            socket.emit('error', 'No content found for the provided file.');
            return;
          }

          const firstFileContent = fileContents[0]?.content || "";

          const courseInstructions = String.raw`
            You are an expert course designer. Given the content of the file provided by the user, create a comprehensive course outline.
            The course should include a title, description, and a list of lessons. 
            Each lesson should have a number, title, description, and a list of sections. 
            Each section should include a number, title, and topics covered.
            The course should be tailored for a ${course_difficulty} difficulty level.
            Ensure the course is well-structured and covers all essential aspects of the subject.
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
            thumbnail_url: '',
            difficulty: course_difficulty,
            visibility: 'private',
            status: 'pending',
            total_lessons: 0,
            total_sections: 0,
          });

          if (!createdCourse) {
            socket.emit('error', 'Failed to create course record.');
            return;
          }

          for (let i = 0; i < fileContents.length; i++) {
            const fileContent = fileContents[i];

            const lessonInstructions = String.raw`
              You are an expert course designer. Based on the course title and description provided, create a detailed lesson. 
              The lesson should have a number, title, description, and a list of sections. 
              Each section should include a number, title, and topics covered.
              The lesson should be tailored for a ${course_difficulty} difficulty level.
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
                  section_number: section.number,
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

            let totalItemsProcessed = 0;

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

  private async generateQuizOnly(
    socket: Socket,
    subject: string,
    difficulty: GenerationCourseDifficulty
  ) {
    try {
      const currentUser = await this.getCurrentUser(socket);
      if (!currentUser) return;

      const courseWithLessonsInstructions = String.raw`
        You are an expert course designer. Given the subject provided by the user, create a comprehensive course outline.
        The course should include a title, description, and a list of lessons. 
        Each lesson should have a number, title, description, and a list of sections. 
        Each section should include a number, title, and topics covered.
        The course should be tailored for a ${difficulty} difficulty level.
        Ensure the course is well-structured and covers all essential aspects of the subject.
        Provide the response in the specified structured format.
      `;
      const courseWithLessonsContent = `Subject: ${subject}`;
      const courseWithLessonsSchema = z.object({
        title: z.string(),
        description: z.string(),
        lessons: z.array(z.object({
          number: z.number(),
          title: z.string(),
          description: z.string(),
          sections: z.array(z.object({
            number: z.number(),
            title: z.string(),
            topics: z.array(z.string()),
          })),
        })),
      });

      const courseWithLessonsResponse = await this.generateWithStructure(
        courseWithLessonsInstructions,
        courseWithLessonsContent,
        courseWithLessonsSchema,
        "course_with_lessons"
      );

      const courseWithLessonsOutput = courseWithLessonsResponse.output_parsed;
      if (!courseWithLessonsOutput) {
        socket.emit('error', 'Failed to parse course lessons output.');
        return;
      }

      const createdCourse = await this.coursesService.create({
        user_id: currentUser.id,
        title: courseWithLessonsOutput.title,
        description: courseWithLessonsOutput.description,
        thumbnail_url: '',
        difficulty: difficulty,
        visibility: 'private',
        status: 'pending',
        total_lessons: courseWithLessonsOutput.lessons.length,
        total_sections: courseWithLessonsOutput.lessons.reduce((sum, lesson) => sum + lesson.sections.length, 0),
      });

      if (!createdCourse) {
        socket.emit('error', 'Failed to create course record.');
        return;
      }

      const createdLessons = await this.lessonsService.createMany(
        courseWithLessonsOutput.lessons.map(lesson => ({
          course_id: createdCourse.id,
          title: lesson.title,
          description: lesson.description,
          lesson_number: lesson.number,
          status: 'pending',
        }))
      );

      if (!createdLessons || createdLessons.length === 0) {
        socket.emit('error', 'Failed to create lesson records.');
        return;
      }

      const newLessonSections: CreateLessonSectionDto[] = [];
      for (let i = 0; i < createdLessons.length; i++) {
        const lesson = courseWithLessonsOutput.lessons.find(l =>
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
              section_number: section.number,
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

      let currentProgress = 0;
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

            const lessonSectionsInstructions = String.raw`
              You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
              Ensure the content is informative, engaging, and covers all topics provided.
              Additionally, provide a concise summary of the section content for future reference.
              Provide the response in the specified structured format.
            `;
            const lessonSectionsContent = `Lesson Title: ${lesson.title}\nPrevious Summary: ${previousSummary}\nSection Title: ${lessonSectionsPerLesson[j].title}\nTopics: ${lessonSectionsPerLesson[j].topics.join(", ")}`;
            const lessonSectionsSchema = z.object({
              title: z.string(),
              content: z.string(),
              summary: z.string(),
            });

            const lessonSectionsResponse = await this.generateWithStructure(
              lessonSectionsInstructions,
              lessonSectionsContent,
              lessonSectionsSchema,
              "lesson_sections_content"
            );

            const lessonSectionsOutput = lessonSectionsResponse.output_parsed;
            if (lessonSectionsOutput) {
              const updatedLessonSection = await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                content: lessonSectionsOutput.content,
                summary: lessonSectionsOutput.summary,
                status: 'ready',
              });

              previousSummary = updatedLessonSection ? updatedLessonSection.summary : "";
            }

            await this.lessonsService.update(lesson.id, {
              status: 'ready',
            });

            totalItemsProcessed++;

            currentProgress = (totalItemsProcessed / createdLessonSections.length) * 100;
            const generationProgress: GenerationProgress = {
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

  // private async generateCourseFromFile(socket: Socket, file_id: string, difficulty_level: GenerationDifficultyLevel) {

  // }

  // private async generateCourseFromUrl(socket: Socket, url: string, difficulty_level: GenerationDifficultyLevel) {

  // }

  // private async generateCourseFromYoutubeUrl(socket: Socket, youtube_url: string, difficulty_level: GenerationDifficultyLevel) {

  // }
}
