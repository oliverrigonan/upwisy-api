import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileContentsDocument = HydratedDocument<FileContentsCollection>;

@Schema()
export class FileContentsCollection {
    @Prop()
    file_id: string;

    @Prop()
    content: string;
}

export const FileContentsSchema = SchemaFactory.createForClass(FileContentsCollection);