import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentLessonSectionDto } from './create-enrollment-lesson-section.dto';

export class UpdateEnrollmentLessonSectionDto extends PartialType(CreateEnrollmentLessonSectionDto) {}
