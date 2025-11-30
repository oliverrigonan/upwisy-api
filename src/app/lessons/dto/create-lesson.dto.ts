export class CreateLessonDto {
  course_id: string;
  title: string;
  description: string;
  lesson_number: number;
  outline: string[];
  status: string;
}
