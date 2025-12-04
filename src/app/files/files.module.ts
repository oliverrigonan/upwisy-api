import { Module } from '@nestjs/common';

import { FilesController } from './files.controller';

import { FilesService } from './files.service';
import { FileContentsService } from '../file-contents/file-contents.service';

import { DatabaseModule } from './../../database/database.module';
import { FilesModelProvider } from './../../database/schemas/files.schema';
import { FileContentsModelProvider } from './../../database/schemas/file-contents.schema';

@Module({
  controllers: [
    FilesController
  ],
  providers: [
    FilesService,
    FileContentsService,

    FilesModelProvider,
    FileContentsModelProvider
  ],
  imports: [DatabaseModule],
})
export class FilesModule { }
