export type GenerationSource =
  | { value: 'subject'; subject: string }
  | { value: 'file'; file_id: string }

export const DIFFICULTY_LEVELS = ['beginner', 'intermediate', 'advanced'] as const;
export type GenerationDifficulty = typeof DIFFICULTY_LEVELS[number];

export type GenerationType =
  | {
    value: 'full_course';
    source: GenerationSource;
    is_mandatory: boolean;
  }
  | {
    value: 'quiz_only_course';
    file_id: string;
  };

export class GenerateCourseDto {
  type!: GenerationType;
  difficulty!: GenerationDifficulty;
}

export class GenerateFullCourseDto {
  source!: GenerationSource;
  difficulty!: GenerationDifficulty;
}

export class GenerateQuizOnlyCourseDto {
  file_id!: string;
  difficulty!: GenerationDifficulty;
}