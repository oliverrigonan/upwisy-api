import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionsDocument = HydratedDocument<SessionsCollection>;

@Schema()
export class SessionsCollection {
    @Prop()
    user_id: string;

    @Prop()
    course_id: string;

    @Prop()
    course_lesson_id: string;

    @Prop()
    start_time: string;

    @Prop()
    end_time: string;

    @Prop()
    duration_seconds: number;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const SessionsSchema = SchemaFactory.createForClass(SessionsCollection);