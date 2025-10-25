import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FilesDocument = HydratedDocument<FilesCollection>;

@Schema()
export class FilesCollection {
    @Prop()
    user_id: string;

    @Prop()
    course_id: string;

    @Prop()
    file_url: string;

    @Prop()
    created_at: Date;

    @Prop()
    updated_at: Date;
}

export const FilesSchema = SchemaFactory.createForClass(FilesCollection);