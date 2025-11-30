import { Injectable, Logger } from '@nestjs/common';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

@Injectable()
export class UpwisyService {

  openai = new OpenAI();

  courseLessonsStructure = z.object({
    title: z.string(),
    description: z.string(),
    lessons: z.array(z.object({
      title: z.string(),
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

  async generateCourseFromFileUploads(): Promise<void> {

  }

  async generateCourseFromSubject(subject: string): Promise<void> {
    const courseLessonsInstructions = String.raw`
      You are an expert course designer. Given the subject provided by the user, create a comprehensive course outline.
      The course should include a title, description, and a list of lessons. Each lesson should have a title and a list of sections. 
      Each section should include a number, title, and topics covered.
      Ensure the course is well-structured and covers all essential aspects of the subject.
      Provide the response in the specified structured format.
    `;

    const courseLessonsResponse = await this.openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        { role: "system", content: courseLessonsInstructions },
        { role: "user", content: `Subject: ${subject}` },
      ],
      text: {
        format: zodTextFormat(this.courseLessonsStructure, "course"),
      },
    });

    const courseLessonsOutput = courseLessonsResponse.output_parsed;
    if (courseLessonsOutput) {
      Logger.log(courseLessonsOutput);

      if (courseLessonsOutput.lessons.length > 0) {
        for (let i = 0; i < courseLessonsOutput.lessons.length; i++) {
          const lesson = courseLessonsOutput.lessons[i];
          const lessonSections = lesson.sections;

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
              previousSummary = lessonSectionsOutput ? lessonSectionsOutput.summary : "";

              Logger.log(lessonSectionsOutput);
            }
          }
        }
      }
    }
  }

  generateCourseFromTextContent(): void {

  }

  generateCourseFromWebsiteLink(): void {

  }

  generateCourseFromYoutubeUrl(): void {

  }

  generateAssessmentsFromCourse(): void {

  }

  generateAssessmentsFromCourseLessons(): void {

  }

  generateAssessmentsFromFileUploads(): void {

  }

}
