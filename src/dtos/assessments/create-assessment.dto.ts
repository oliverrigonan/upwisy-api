export class CreateAssessmentDto {
    user_id: string;
    type: string;
    course_id: string;
    course_lesson_id: string;
    difficulty: string;
    total_items: number;
    score: number;
    comments: string;
    is_submitted: boolean;
    start_time: Date;
    end_time: Date;
    duration_seconds: number;
}