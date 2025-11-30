import { Module } from '@nestjs/common';
import { CourseGeneratorModule } from './course-generator/course-generator.module';

@Module({
  imports: [
    CourseGeneratorModule
  ],
})
export class UpwisyModule { }
