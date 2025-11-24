import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { FilesService } from './files.service';
import { FilesController } from './files.controller';

import { DatabaseModule } from './../../database/database.module';
import { FilesSchema } from 'src/database/schemas/files.schema';

@Module({
  controllers: [
    FilesController
  ],
  providers: [
    FilesService,
    {
      provide: 'FILES_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('files', FilesSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class FilesModule { }
