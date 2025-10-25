import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssessmentsDocument = HydratedDocument<AssessmentsCollection>;

@Schema()
export class AssessmentsCollection {
    @Prop()
    user_id: string;

    @Prop()
    type: string;

    @Prop()
    course_id: string;

    @Prop()
    course_lesson_id: string;

    @Prop()
    difficulty: string;

    @Prop()
    total_items: number;

    @Prop()
    score: number;

    @Prop()
    comments: string;

    @Prop()
    is_submitted: boolean;

    @Prop()
    start_time: Date;

    @Prop()
    end_time: Date;

    @Prop()
    duration_seconds: number;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const AssessmentsSchema = SchemaFactory.createForClass(AssessmentsCollection);