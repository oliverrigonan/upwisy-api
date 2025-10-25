export interface Courses {
    user_id: string;
    date: Date;
    title: string;
    details: string;
    visibility: 'private' | 'public';
    owner_user_id: string;
    status: string;
    created_at: Date;
    updated_at: Date;
}
