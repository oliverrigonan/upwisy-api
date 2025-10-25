import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CourseLessonsDocument = HydratedDocument<CourseLessonsCollection>;

@Schema()
export class CourseLessonsCollection {
    @Prop()
    course_id: string;

    @Prop()
    title: string;

    @Prop()
    lesson: string;

    @Prop()
    status: string;
}

export const CourseLessonsSchema = SchemaFactory.createForClass(CourseLessonsCollection);