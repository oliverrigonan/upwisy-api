import { Module } from '@nestjs/common';

import { FileContentsService } from './file-contents.service';
import { FileContentsController } from './file-contents.controller';

import { DatabaseModule } from './../../database/database.module';
import { FileContentsModelProvider } from './../../database/schemas/file-contents.schema';

@Module({
  controllers: [
    FileContentsController
  ],
  providers: [
    FileContentsService,
    FileContentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class FileContentsModule { }
