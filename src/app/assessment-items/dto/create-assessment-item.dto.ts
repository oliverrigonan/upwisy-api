export class CreateAssessmentItemDto {
  assessment_id: string;
  type: string;
  question: string;
  options: [{ option: string; content: string }];
  correct_answer: string;
  user_answer: string;
  percentage_correct: number;
  is_correct: boolean;
  answer_explanation: string;
}
