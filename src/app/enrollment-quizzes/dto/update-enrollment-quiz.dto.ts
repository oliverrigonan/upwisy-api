import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentQuizDto } from './create-enrollment-quiz.dto';

export class UpdateEnrollmentQuizDto extends PartialType(CreateEnrollmentQuizDto) { }