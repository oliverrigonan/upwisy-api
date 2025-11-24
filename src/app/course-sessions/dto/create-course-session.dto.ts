export class CreateCourseSessionDto {
    user_id: string;
    course_id: string;
    course_lesson_id: string;
    start_time: string;
    end_time: string;
    duration_seconds: number;
}
