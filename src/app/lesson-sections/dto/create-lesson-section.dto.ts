export class CreateLessonSectionDto {
  lesson_id: string;
  title: string;
  topics: string[];
  content: string;
  summary: string;
  tokens_used: number;
  status: string;
}
