import { PartialType } from '@nestjs/swagger';
import { CreateAssessmentItemDto } from './create-assessment-item.dto';

export class UpdateAssessmentItemDto extends PartialType(CreateAssessmentItemDto) { }
