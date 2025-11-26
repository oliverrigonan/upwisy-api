import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';

@Module({
  controllers: [
    OpenaiController
  ],
  providers: [
    OpenaiService
  ],
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ]
})
export class OpenaiModule { }
