import { Module } from '@nestjs/common';

import { CourseGeneratorModule } from './course-generator/course-generator.module';
import { AssessmentGeneratorModule } from './assessment-generator/assessment-generator.module';

@Module({
  imports: [
    CourseGeneratorModule,
    AssessmentGeneratorModule
  ],
})
export class UpwisyModule { }
