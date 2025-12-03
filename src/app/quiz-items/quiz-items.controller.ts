import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { QuizItemsService } from './quiz-items.service';
import { CreateQuizItemDto } from './dto/create-quiz-item.dto';
import { UpdateQuizItemDto } from './dto/update-quiz-item.dto';

@Controller('quiz-items')
export class QuizItemsController {
  constructor(private readonly quizItemsService: QuizItemsService) {}

  @Post()
  create(@Body() createQuizItemDto: CreateQuizItemDto) {
    return this.quizItemsService.create(createQuizItemDto);
  }

  @Get()
  findAll() {
    return this.quizItemsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizItemsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuizItemDto: UpdateQuizItemDto) {
    return this.quizItemsService.update(+id, updateQuizItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizItemsService.remove(+id);
  }
}
