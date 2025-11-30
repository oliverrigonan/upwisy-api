import { PartialType } from '@nestjs/swagger';
import { CreateLearningPlanDto } from './create-learning-plan.dto';

export class UpdateLearningPlanDto extends PartialType(CreateLearningPlanDto) { }
