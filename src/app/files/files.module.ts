import { Module } from '@nestjs/common';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';

import { DatabaseModule } from './../../database/database.module';
import { FilesModelProvider } from './../../database/schemas/files.schema';

@Module({
  controllers: [
    FilesController
  ],
  providers: [
    FilesService,
    FilesModelProvider
  ],
  imports: [DatabaseModule],
})
export class FilesModule { }
