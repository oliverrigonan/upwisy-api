import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentQuizItemDto } from './create-enrollment-quiz-item.dto';

export class UpdateEnrollmentQuizItemDto extends PartialType(CreateEnrollmentQuizItemDto) {}
