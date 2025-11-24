export class CreateUserDto {
    full_name: string;
    email: string;
    username: string;
    hashed_password: string;
    type: string;
    is_disabled: boolean;
    photo_url: string;
    google_account_id: string;
    session_id: string;
}
