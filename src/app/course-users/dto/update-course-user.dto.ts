import { PartialType } from '@nestjs/swagger';
import { CreateCourseUserDto } from './create-course-user.dto';

export class UpdateCourseUserDto extends PartialType(CreateCourseUserDto) { }
