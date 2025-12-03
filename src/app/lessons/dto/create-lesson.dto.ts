export class CreateLessonDto {
  course_id: string;
  title: string;
  description: string;
  lesson_number: number;
  total_lesson_sections: number;
  status: string;
}
