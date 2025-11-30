import { Module } from '@nestjs/common';
import { UpwisyService } from './upwisy.service';
import { UpwisyController } from './upwisy.controller';

@Module({
  controllers: [UpwisyController],
  providers: [UpwisyService],
})
export class UpwisyModule {}
