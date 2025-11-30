import { WebSocketGateway, WebSocketServer, SubscribeMessage, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { UseGuards } from '@nestjs/common';

import { Server, Socket } from 'socket.io';

import { AuthGuard } from './../../../app/auth/auth.ws-guard';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

import { GenerateCourseFromSubjectDto } from './dto/generate-course-from-subject.dto';
import { GenerateCourseProgress } from './interfaces/generate-course-progress.interface';

import { CoursesService } from './../../courses/courses.service';
import { LessonsService } from 'src/app/lessons/lessons.service';
import { LessonSectionsService } from 'src/app/lesson-sections/lesson-sections.service';
import { CreateCourseDto } from 'src/app/courses/dto/create-course.dto';
import { CreateLessonDto } from 'src/app/lessons/dto/create-lesson.dto';
import { CreateLessonSectionDto } from 'src/app/lesson-sections/dto/create-lesson-section.dto';
import { UpdateLessonDto } from 'src/app/lessons/dto/update-lesson.dto';
import { UsersService } from 'src/app/users/users.service';

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

  @SubscribeMessage('generate-course-from-subject')
  async handleGenerateCourseFromSubject(
    @MessageBody() data: GenerateCourseFromSubjectDto,
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
        socket.emit('error', 'Invalid GenerateCourseFromSubject data received.');
        return;
      }

      try {
        if (!this.matchesClassShape(data, GenerateCourseFromSubjectDto)) {
          socket.emit('generate-course-error', 'Invalid GenerateCourseFromSubject structure');
          return;
        }
      } catch (validationError) {
        socket.emit('generate-course-error', validationError.message);
        return;
      }

      let progressPercentage = 0;

      const courseLessonsInstructions = String.raw`
        You are an expert course designer. Given the subject provided by the user, create a comprehensive course outline.
        The course should include a title, description, and a list of lessons. Each lesson should have a number, title, description, and a list of sections. 
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
      if (courseLessonsOutput) {
        const totalLessons = courseLessonsOutput.lessons.length;
        const totalSections = courseLessonsOutput.lessons.reduce((sum, lesson) => sum + lesson.sections.length, 0);

        const newCourse: CreateCourseDto = {
          user_id: user.id,
          title: courseLessonsOutput.title,
          description: courseLessonsOutput.description,
          thumbnail_url: '',
          difficulty: data.difficulty,
          visibility: 'private',
          status: 'pending',
          total_lessons: totalLessons,
          total_sections: totalSections,
        };
        const createdCourse = await this.coursesService.create(newCourse);

        const newLessons: CreateLessonDto[] = courseLessonsOutput.lessons.map(lesson => ({
          course_id: createdCourse.id,
          title: lesson.title,
          description: lesson.description,
          lesson_number: lesson.number,
          status: 'pending',
        }));
        const createdLessons = await this.lessonsService.createMany(newLessons);

        const newLessonSections: CreateLessonSectionDto[] = [];
        if (createdLessons.length > 0) {
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
        }
        const createdLessonSections = await this.lessonSectionsService.createMany(newLessonSections);

        if (createdLessons.length > 0) {
          let sectionsProcessed = 0;

          for (let i = 0; i < createdLessons.length; i++) {
            const lesson = createdLessons[i];
            const lessonSections = createdLessonSections.filter(section => section.lesson_id.toString() === lesson.id.toString());

            let previousSummary = "";

            if (lessonSections.length > 0) {
              for (let j = 0; j < lessonSections.length; j++) {
                const sectionTitle = lessonSections[j].title;

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
                      content: `Lesson Title: ${lesson.title}\nPrevious Summary: ${previousSummary}\nSection Title: ${sectionTitle}\nTopics: ${lessonSections[j].topics.join(", ")}`,
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

                  const updateLessonSectionDto: Partial<CreateLessonSectionDto> = {
                    content: updatedContent,
                    summary: updatedSummary,
                    status: 'completed',
                  };

                  const updatedLessonSection = await this.lessonSectionsService.update(lessonSections[j].id, updateLessonSectionDto);
                  previousSummary = updatedLessonSection ? updatedLessonSection.summary : "";
                }

                const updateLessonDto: Partial<UpdateLessonDto> = {
                  status: 'completed',
                };
                await this.lessonsService.update(lesson.id, updateLessonDto);

                sectionsProcessed++;

                progressPercentage = sectionsProcessed / totalSections * 100;
                const progress: GenerateCourseProgress = {
                  progressPercentage: progressPercentage,
                  message: 'Generated lesson section ' + sectionsProcessed + ' of ' + totalSections,
                };
                socket.emit('generate-course-progress', progress);
              }
            }
          }
        }
      }

      const progress: GenerateCourseProgress = {
        progressPercentage: progressPercentage,
        message: 'Course generation completed successfully.',
      };
      socket.emit('generate-course-progress', progress);
    } catch (error) {
      socket.emit('error', 'An E ' + error.message);
      return;
    }
  }
}
