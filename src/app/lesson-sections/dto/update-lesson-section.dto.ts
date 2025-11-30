import { PartialType } from '@nestjs/swagger';
import { CreateLessonSectionDto } from './create-lesson-section.dto';

export class UpdateLessonSectionDto extends PartialType(CreateLessonSectionDto) { }
