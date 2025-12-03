import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentQuizzesService } from './enrollment-quizzes.service';
import { CreateEnrollmentQuizzDto } from './dto/create-enrollment-quizz.dto';
import { UpdateEnrollmentQuizzDto } from './dto/update-enrollment-quizz.dto';

@Controller('enrollment-quizzes')
export class EnrollmentQuizzesController {
  constructor(private readonly enrollmentQuizzesService: EnrollmentQuizzesService) {}

  @Post()
  create(@Body() createEnrollmentQuizzDto: CreateEnrollmentQuizzDto) {
    return this.enrollmentQuizzesService.create(createEnrollmentQuizzDto);
  }

  @Get()
  findAll() {
    return this.enrollmentQuizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentQuizzesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentQuizzDto: UpdateEnrollmentQuizzDto) {
    return this.enrollmentQuizzesService.update(+id, updateEnrollmentQuizzDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentQuizzesService.remove(+id);
  }
}
