export class CreateCourseDto {
  user_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  difficulty: string;
  visibility: string;
  status: string;
  total_lessons: number;
  total_sections: number;
}
