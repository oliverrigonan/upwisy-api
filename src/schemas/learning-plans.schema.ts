import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type LearningPlansDocument = HydratedDocument<LearningPlansCollection>;

@Schema()
export class LearningPlansCollection {
    @Prop()
    user_id: string;

    @Prop()
    course_id: string;

    @Prop()
    date: Date;

    @Prop()
    start_time: string;

    @Prop()
    end_time: string;

    @Prop()
    repetition: string;

    @Prop([String])
    days_of_week: string[];

    @Prop()
    ends: string;

    @Prop()
    ends_on_date: Date;

    @Prop()
    notes: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const LearningPlansSchema = SchemaFactory.createForClass(LearningPlansCollection);