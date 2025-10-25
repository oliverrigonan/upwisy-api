export class CreateCourseDto {
    user_id: string;
    date: Date;
    title: string;
    details: string;
    visibility: 'private' | 'public';
    owner_user_id: string;
    status: string;
}