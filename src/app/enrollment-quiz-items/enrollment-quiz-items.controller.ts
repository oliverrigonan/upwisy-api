import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { CreateEnrollmentQuizItemDto } from './dto/create-enrollment-quiz-item.dto';
import { UpdateEnrollmentQuizItemDto } from './dto/update-enrollment-quiz-item.dto';

@Controller('enrollment-quiz-items')
export class EnrollmentQuizItemsController {
  constructor(private readonly enrollmentQuizItemsService: EnrollmentQuizItemsService) {}

  @Post()
  create(@Body() createEnrollmentQuizItemDto: CreateEnrollmentQuizItemDto) {
    return this.enrollmentQuizItemsService.create(createEnrollmentQuizItemDto);
  }

  @Get()
  findAll() {
    return this.enrollmentQuizItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollmentQuizItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEnrollmentQuizItemDto: UpdateEnrollmentQuizItemDto) {
    return this.enrollmentQuizItemsService.update(+id, updateEnrollmentQuizItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollmentQuizItemsService.remove(+id);
  }
}
