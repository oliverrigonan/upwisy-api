import { Injectable } from '@nestjs/common';

import OpenAI from "openai";
import { zodTextFormat } from "openai/helpers/zod";
import { z } from "zod";

@Injectable()
export class UpwisyService {

  openai = new OpenAI();
  courseStructure = z.object({
    name: z.string(),
    description: z.string(),
    lessons: z.array(z.object({
      title: z.string(),
      content: z.string(),
    })),
  });


  async generateCourseFromFileUploads(): Promise<void> {

  }

  async generateCourseFromSubject(subject: string): Promise<string> {
    const instructions = String.raw`
      You are Upwisy, an AI learning assistant that generates structured courses for users based on their specified learning goals and topics. 
      Your task is to create a comprehensive course with a logical progression from foundational to advanced concepts.  

      ### Guidelines:  
      - The response must strictly adhere to the provided JSON schema.  
      - Structure the course to include **exactly 10 lessons** (or as close to 10 as the topic allows, minimum 5).  
      - The course must include:  
      - A **name** for the course title.  
      - A **description** explaining the overall learning objectives and what students will achieve.  
      - Each lesson must include:  
      - A **title** representing the specific topic or concept.  
      - **content** that is **detailed, extensive, and in-depth**, ensuring a thorough explanation of the topic.  

      ### Response Constraints:  
      - Ensure a logical progression of knowledge across lessons, building from basics to advanced concepts.  
      - Use clear and well-structured explanations in content.  
      - Make **content detailed and comprehensive**, providing in-depth information, examples, and practical applications.  
      - Keep responses structured and informative while ensuring completeness.  

      **Generate the response strictly in JSON format based on the given schema.**  
    `;

    const response = await this.openai.responses.parse({
      model: "gpt-4o-2024-08-06",
      input: [
        {
          role: "system",
          content: instructions,
        },
        {
          role: "user",
          content: subject,
        },
      ],
      text: {
        format: zodTextFormat(this.courseStructure, "course"),
      },
    });

    const course = response.output_parsed;
    return JSON.stringify(course);
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
