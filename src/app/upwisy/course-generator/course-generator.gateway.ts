import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateCourseFromSubjectDto } from './dto/generate-course.dto';
import { GenerationProgress } from './../interfaces/generation-progress.interface';

import { UsersService } from './../../users/users.service';
import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from './../../lessons/lessons.service';
import { LessonSectionsService } from './../../lesson-sections/lesson-sections.service';

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
  ) { }

  openai = new OpenAI();
  courseLessonsStructure = z.object({
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
  lessonSectionsStructure = z.object({
    title: z.string(),
    content: z.string(),
    summary: z.string(),
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
    data: GenerateCourseFromSubjectDto,
    dataDtoClass: new () => GenerateCourseFromSubjectDto,
    socket: Socket,
  ): Promise<{ user: any } | null> {
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

  @SubscribeMessage('generate-course-from-subject')
  async handleGenerateCourseFromSubject(
    @MessageBody() data: GenerateCourseFromSubjectDto,
    @ConnectedSocket() socket: Socket,
  ): Promise<void> {
    try {
      const validation = await this.performValidation(data, GenerateCourseFromSubjectDto, socket);
      if (!validation) return;

      const { user } = validation;

      let progress = 0;
      let itemsProcessed = 0;
      let itemsTotal = 0;

      const courseLessonsInstructions = String.raw`
        You are an expert course designer. Given the subject provided by the user, create a comprehensive course outline.
        The course should include a title, description, and a list of lessons. 
        Each lesson should have a number, title, description, and a list of sections. 
        Each section should include a number, title, and topics covered.
        Ensure the course is well-structured and covers all essential aspects of the subject.
        Provide the response in the specified structured format.
      `;

      const courseLessonsResponse = await this.openai.responses.parse({
        model: "gpt-4o-2024-08-06",
        input: [
          { role: "system", content: courseLessonsInstructions },
          { role: "user", content: `Subject: ${data.subject}` },
        ],
        text: {
          format: zodTextFormat(this.courseLessonsStructure, "course"),
        },
      });

      const courseLessonsOutput = courseLessonsResponse.output_parsed;
      if (!courseLessonsOutput) {
        socket.emit('error', 'Failed to parse course lessons output.');
        return;
      }

      const createdCourse = await this.coursesService.create({
        user_id: user.id,
        title: courseLessonsOutput.title,
        description: courseLessonsOutput.description,
        thumbnail_url: '',
        difficulty: data.difficulty,
        visibility: 'private',
        status: 'pending',
        total_lessons: courseLessonsOutput.lessons.length,
        total_sections: courseLessonsOutput.lessons.reduce((sum, lesson) => sum + lesson.sections.length, 0),
      });

      if (!createdCourse) {
        socket.emit('error', 'Failed to create course record.');
        return;
      }

      const createdLessons = await this.lessonsService.createMany(
        courseLessonsOutput.lessons.map(lesson => ({
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
        const lesson = courseLessonsOutput.lessons.find(l =>
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

      itemsTotal = createdLessonSections.length;

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

            const sectionTitle = lessonSectionsPerLesson[j].title;
            const lessonSectionsInstructions = String.raw`
                You are an expert content creator. Given the lesson title, previous section summary, section title, and topics, create detailed content for the lesson section.
                Ensure the content is informative, engaging, and covers all topics provided.
                Additionally, provide a concise summary of the section content for future reference.
                Provide the response in the specified structured format.
              `;

            const lessonSectionsResponse = await this.openai.responses.parse({
              model: "gpt-4o-2024-08-06",
              input: [
                { role: "system", content: lessonSectionsInstructions },
                {
                  role: "user",
                  content: `Lesson Title: ${lesson.title}\nPrevious Summary: ${previousSummary}\nSection Title: ${sectionTitle}\nTopics: ${lessonSectionsPerLesson[j].topics.join(", ")}`,
                },
              ],
              text: {
                format: zodTextFormat(this.lessonSectionsStructure, "lesson_sections"),
              },
            });

            const lessonSectionsOutput = lessonSectionsResponse.output_parsed;
            if (lessonSectionsOutput) {
              const updatedContent = lessonSectionsOutput.content;
              const updatedSummary = lessonSectionsOutput.summary;

              const updatedLessonSection = await this.lessonSectionsService.update(lessonSectionsPerLesson[j].id, {
                content: updatedContent,
                summary: updatedSummary,
                status: 'ready',
              });

              previousSummary = updatedLessonSection ? updatedLessonSection.summary : "";
            }

            await this.lessonsService.update(lesson.id, {
              status: 'ready',
            });

            itemsProcessed++;

            progress = itemsProcessed / itemsTotal * 100;
            const generationProgress: GenerationProgress = {
              progress: progress,
              message: 'Generated ' + itemsProcessed + ' of ' + itemsTotal,
            };
            socket.emit('generation-progress', generationProgress);
          }
        }
      }

      await this.coursesService.update(createdCourse.id, {
        status: 'ready',
      });

      const generationProgress: GenerationProgress = {
        progress: progress,
        message: 'Generation completed successfully.',
      };
      socket.emit('generation-progress', generationProgress);
    } catch (error) {
      socket.emit('error', 'An E ' + error.message);
      return;
    }
  }
}
