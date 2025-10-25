export class CreateAssessmentItemDto {
    assessment_id: string;
    question: string;
    options: { option: string; content: string }[];
    correct_answer: string;
    user_answer: string;
    is_correct: boolean;
}