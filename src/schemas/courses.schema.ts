import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CoursesDocument = HydratedDocument<CoursesCollection>;

@Schema()
export class CoursesCollection {
    @Prop()
    user_id: string;

    @Prop()
    date: Date;

    @Prop()
    title: string;

    @Prop()
    details: string;

    @Prop()
    visibility: 'private' | 'public';

    @Prop()
    owner_user_id: string;

    @Prop()
    status: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const CoursesSchema = SchemaFactory.createForClass(CoursesCollection);