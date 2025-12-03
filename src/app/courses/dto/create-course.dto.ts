export class CreateCourseDto {
  user_id: string;
  title: string;
  description: string;
  difficulty: string;
  type: string;
  is_mandatory: boolean;
  material_file_id: string | null;
  visibility: string;
  total_lessons: number;
  total_quizzes: number;
  status: string;
}
