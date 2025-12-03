import { PartialType } from '@nestjs/swagger';
import { CreateQuizItemDto } from './create-quiz-item.dto';

export class UpdateQuizItemDto extends PartialType(CreateQuizItemDto) {}
