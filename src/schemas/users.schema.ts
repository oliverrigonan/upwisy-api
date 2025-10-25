import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UsersDocument = HydratedDocument<UsersCollection>;

@Schema()
export class UsersCollection {
    @Prop()
    full_name: string;

    @Prop()
    email: string;

    @Prop()
    username: string;

    @Prop()
    hashed_password: string;

    @Prop()
    type: string;

    @Prop()
    is_disabled: boolean;

    @Prop()
    photo_url: string;

    @Prop()
    google_account_id: string;

    @Prop()
    session_id: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const UsersSchema = SchemaFactory.createForClass(UsersCollection);
