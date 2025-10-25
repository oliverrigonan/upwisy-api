import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssessmentItemsDocument = HydratedDocument<AssessmentItemsCollection>;

@Schema()
export class AssessmentItemsCollection {
    @Prop()
    assessment_id: string;

    @Prop()
    question: string;

    @Prop({ type: [{ option: String, content: String }] })
    options: { option: string; content: string }[];

    @Prop()
    correct_answer: string;

    @Prop()
    user_answer: string;

    @Prop()
    is_correct: boolean;
}

export const AssessmentItemsSchema = SchemaFactory.createForClass(AssessmentItemsCollection);