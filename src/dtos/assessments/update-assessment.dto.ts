export class UpdateAssessmentDto {
    type: string;
    course_id: string;
    course_lesson_id: string;
    difficulty: string;
    is_submitted: boolean;
    start_time: Date;
    end_time: Date;
    duration_seconds: number;
}