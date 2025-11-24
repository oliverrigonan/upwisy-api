import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { FileContentsService } from './file-contents.service';
import { FileContentsController } from './file-contents.controller';

import { DatabaseModule } from './../../database/database.module';
import { FileContentsSchema } from 'src/database/schemas/file-contents.schema';

@Module({
  controllers: [
    FileContentsController
  ],
  providers: [
    FileContentsService,
    {
      provide: 'FILE_CONTENTS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('file_contents', FileContentsSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class FileContentsModule { }
