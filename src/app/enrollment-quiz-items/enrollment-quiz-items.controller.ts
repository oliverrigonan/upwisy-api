import { Controller, Get, Body, Patch, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentQuizItemsService } from './enrollment-quiz-items.service';
import { EnrollmentQuizzesService } from '../enrollment-quizzes/enrollment-quizzes.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';

import { QuizItemsService } from '../quiz-items/quiz-items.service';

import { SubmitEnrollmentQuizItemDto } from './dto/submit-enrollment-quiz-item.dto';

@ApiTags('Enrollment Quiz Items')
@Controller('api/enrollment-quiz-items')
export class EnrollmentQuizItemsController {

  constructor(
    private readonly enrollmentQuizItemsService: EnrollmentQuizItemsService,
    private readonly enrollmentQuizzesService: EnrollmentQuizzesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly quizItemsService: QuizItemsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('submit-quiz/:enrollment_quiz_id')
  async submitQuiz(
    @Param('enrollment_quiz_id') enrollment_quiz_id: string,
    @Body() submitEnrollmentQuizItemDtos: SubmitEnrollmentQuizItemDto[]
  ) {
    try {
      const enrollmentQuiz = await this.enrollmentQuizzesService.findOne(enrollment_quiz_id);
      if (!enrollmentQuiz) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz not found',
            error: `The enrollment quiz with ID ${enrollment_quiz_id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      if (!submitEnrollmentQuizItemDtos || submitEnrollmentQuizItemDtos.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'No quiz items to update',
            error: 'The request body is empty.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const enrollmentQuizItems = await this.enrollmentQuizItemsService.findByEnrollmentQuizId(enrollment_quiz_id);
      if (!enrollmentQuizItems || enrollmentQuizItems.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Enrollment quiz items not found',
            error: `No enrollment quiz items found for enrollment quiz ID ${enrollment_quiz_id}.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      let score = 0;

      for (const submitEnrollmentQuizItemDto of submitEnrollmentQuizItemDtos) {
        const enrollmentQuizItem = enrollmentQuizItems.filter(item => item.quiz_item_id.toString() === submitEnrollmentQuizItemDto.quiz_item_id.toString());
        if (enrollmentQuizItem) {
          const quizItem = await this.quizItemsService.findOne(submitEnrollmentQuizItemDto.quiz_item_id);

          let isCorrect = false;
          if (quizItem) {
            isCorrect = quizItem.correct_answer === submitEnrollmentQuizItemDto.user_answer;
          }

          if (isCorrect) {
            score++;
          }

          await this.enrollmentQuizItemsService.update(enrollmentQuizItem[0].id, {
            user_answer: submitEnrollmentQuizItemDto.user_answer,
            is_correct: isCorrect,
            answered_at: new Date(),
          });
        }
      }

      await this.enrollmentQuizzesService.update(enrollment_quiz_id, {
        date_taken: new Date(),
        score: score,
        is_submitted: true,
      });

      const enrollmentQuizzes = await this.enrollmentQuizzesService.findByEnrollmentId(enrollmentQuiz.enrollment_id.toString());
      await this.enrollmentsService.update(enrollmentQuiz.enrollment_id.toString(), {
        quizzes_taken: enrollmentQuizzes.filter(eq => eq.is_submitted).length,
        status: enrollmentQuizzes.filter(eq => eq.is_submitted).length === enrollmentQuizzes.length ? 'completed' : 'active',
      });

      const updatedEnrollmentQuizItems = await this.enrollmentQuizItemsService.findByEnrollmentQuizId(enrollment_quiz_id);

      return updatedEnrollmentQuizItems;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update enrollment quiz',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-quiz-id/:enrollment_quiz_id')
  async findByEnrollmentQuizId(@Param('enrollment_quiz_id') enrollment_quiz_id: string) {
    const enrollmentQuizItems = await this.enrollmentQuizItemsService.findByEnrollmentQuizId(enrollment_quiz_id);
    return enrollmentQuizItems;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollmentQuizItem = await this.enrollmentQuizItemsService.findOne(id);
    return enrollmentQuizItem;
  }
}
