import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentLessonsService } from './enrollment-lessons.service';
import { CreateEnrollmentLessonDto } from './dto/create-enrollment-lesson.dto';
import { UpdateEnrollmentLessonDto } from './dto/update-enrollment-lesson.dto';

@Controller('enrollment-lessons')
export class EnrollmentLessonsController {
  constructor(private readonly enrollmentLessonsService: EnrollmentLessonsService) {}

  @Post()
  create(@Body() createEnrollmentLessonDto: CreateEnrollmentLessonDto) {
    return this.enrollmentLessonsService.create(createEnrollmentLessonDto);
  }

  @Get()
  findAll() {
    return this.enrollmentLessonsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentLessonsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentLessonDto: UpdateEnrollmentLessonDto) {
    return this.enrollmentLessonsService.update(+id, updateEnrollmentLessonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentLessonsService.remove(+id);
  }
}
