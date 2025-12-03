import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentLessonDto } from './create-enrollment-lesson.dto';

export class UpdateEnrollmentLessonDto extends PartialType(CreateEnrollmentLessonDto) {}
