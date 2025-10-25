import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseUsersDocument = HydratedDocument<CourseUsersCollection>;

@Schema()
export class CourseUsersCollection {
    @Prop()
    course_id: string;

    @Prop()
    user_id: string;

    @Prop()
    status: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const CourseUsersSchema = SchemaFactory.createForClass(CourseUsersCollection);
