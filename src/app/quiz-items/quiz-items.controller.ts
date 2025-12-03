import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { QuizItemsService } from './quiz-items.service';

@ApiTags('Quiz Items')
@Controller('quiz-items')
export class QuizItemsController {

  constructor(
    private readonly quizItemsService: QuizItemsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.quizItemsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-quiz-id/:quiz_id')
  async findByQuizId(@Param('quiz_id') quiz_id: string) {
    const quizItems = await this.quizItemsService.findByQuizId(quiz_id);
    if (!quizItems || quizItems.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No quiz item found for the specified quiz ID',
          error: `No quiz item found with quiz ID ${quiz_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quizItems;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const quizItem = await this.quizItemsService.findOne(id);
    if (!quizItem) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Quiz item not found',
          error: `The quiz item with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return quizItem;
  }
}
