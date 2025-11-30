export class CreateLessonSectionDto {
  lesson_id: string;
  section_number: number;
  title: string;
  topics: string[];
  content: string;
  summary: string;
  tokens_used: number;
  status: string;
}
