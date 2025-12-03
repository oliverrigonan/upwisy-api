export class CreateQuizItemDto {
  quiz_id: string;
  type: string;
  question: string;
  options: { option: string; content: string }[];
  correct_answer: string;
  answer_explanation: string;
}
