
export const QUIZ_DIFFICULTY_LEVELS = ['easy', 'medium', 'hard'] as const;
export const COURSE_DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;

export type GenerationSource =
  | { value: 'subject'; subject: string }
  | { value: 'file'; file_id: string }
  | { value: 'url'; url: string }
  | { value: 'youtube'; youtube_url: string };

export type GenerationQuizDifficulty = typeof QUIZ_DIFFICULTY_LEVELS[number];
export type GenerationCourseDifficulty = typeof COURSE_DIFFICULTY_LEVELS[number];

export type GenerationType =
  | { value: 'full_course'; is_mandatory: boolean; }
  | { value: 'quiz_only'; quiz_difficulty: GenerationQuizDifficulty; };

export class GenerateCourseDto {
  source!: GenerationSource;
  course_difficulty!: GenerationCourseDifficulty;
  type!: GenerationType;
}
