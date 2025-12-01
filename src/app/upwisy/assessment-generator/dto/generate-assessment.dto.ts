export class GenerateAssessmentForQuizDto {
  type: string;
  lesson_id: string;
  difficulty: string;
}

export class GenerateAssessmentForExamDto {
  type: string;
  course_id: string;
  difficulty: string;
}

export class GenerateAssessmentForPracticeDto {
  file_id: string;
  difficulty: string;
}