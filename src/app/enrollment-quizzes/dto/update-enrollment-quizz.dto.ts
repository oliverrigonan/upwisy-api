import { PartialType } from '@nestjs/swagger';
import { CreateEnrollmentQuizzDto } from './create-enrollment-quizz.dto';

export class UpdateEnrollmentQuizzDto extends PartialType(CreateEnrollmentQuizzDto) {}
