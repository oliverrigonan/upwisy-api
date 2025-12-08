import { Controller, Get, Post, Body, Param, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type { Request } from 'express';

import { AuthGuard } from './../auth/auth.http-guard';

import { EnrollmentsService } from './enrollments.service';
import { EnrollmentLessonsService } from './../enrollment-lessons/enrollment-lessons.service';
import { EnrollmentLessonSectionsService } from './..//enrollment-lesson-sections/enrollment-lesson-sections.service';
import { EnrollmentQuizzesService } from './..//enrollment-quizzes/enrollment-quizzes.service';
import { EnrollmentQuizItemsService } from './.././enrollment-quiz-items/enrollment-quiz-items.service';
import { CoursesService } from './../courses/courses.service';
import { LessonsService } from './../lessons/lessons.service';
import { LessonSectionsService, LessonSectionDocument } from './../lesson-sections/lesson-sections.service';
import { QuizzesService } from './../quizzes/quizzes.service';
import { QuizItemsService, QuizItemDocument } from './../quiz-items/quiz-items.service';

import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollUserDto } from './dto/enroll-user.dto';

@ApiTags('Enrollments')
@Controller('api/enrollments')
export class EnrollmentsController {

  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly enrollmentLessonsService: EnrollmentLessonsService,
    private readonly enrollmentLessonSectionsService: EnrollmentLessonSectionsService,
    private readonly enrollmentQuizzesService: EnrollmentQuizzesService,
    private readonly enrollmentQuizItemsService: EnrollmentQuizItemsService,
    private readonly coursesService: CoursesService,
    private readonly lessonsService: LessonsService,
    private readonly lessonSectionsService: LessonSectionsService,
    private readonly quizzesService: QuizzesService,
    private readonly quizItemsService: QuizItemsService,
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('enroll-user')
  async enrollUser(
    @Body() enrollUserDto: EnrollUserDto,
    @Req() req: Request,
  ) {
    try {
      const course = await this.coursesService.findOne(enrollUserDto.course_id);
      if (!course) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Course not found',
            error: `The course with ID ${enrollUserDto.course_id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      const lessons = await this.lessonsService.findByCourseId(enrollUserDto.course_id);

      if (course.type === 'full_course' && lessons.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Cannot enroll user',
            error: `The course with ID ${enrollUserDto.course_id} has no lessons.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const lessonSections: LessonSectionDocument[] = [];
      if (lessons.length > 0) {
        for (const lesson of lessons) {
          const sections = await this.lessonSectionsService.findByLessonId(lesson._id.toString());
          lessonSections.push(...sections);
        }
      }

      const quizzes = await this.quizzesService.findByCourseId(enrollUserDto.course_id);

      if (course.type === 'quiz_only_course' && quizzes.length === 0) {
        throw new HttpException(
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: 'Cannot enroll user',
            error: `The course with ID ${enrollUserDto.course_id} has no quizzes.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const quizItems: QuizItemDocument[] = [];
      if (quizzes.length > 0) {
        for (const quiz of quizzes) {
          const items = await this.quizItemsService.findByQuizId(quiz._id.toString());
          quizItems.push(...items);
        }
      }

      const currentUser = req.user as any;
      const userId = currentUser?.userId;

      const createEnrollmentDto: CreateEnrollmentDto = {
        user_id: userId,
        course_id: enrollUserDto.course_id,
        enrolled_date: new Date(),
        is_anonymous: enrollUserDto.is_anonymous || false,
        display_name: enrollUserDto.display_name || '',
        session_id: null,
        total_lessons: course.total_lessons || 0,
        lessons_completed: 0,
        quizzes_taken: 0,
        status: 'enrolled',
      };

      const createdEnrollment = await this.enrollmentsService.create(createEnrollmentDto);

      const createdEnrollmentLessons = await this.enrollmentLessonsService.createMany(
        lessons.map(lesson => ({
          enrollment_id: createdEnrollment.id,
          lesson_id: lesson._id.toString(),
          total_lesson_sections: lesson.total_lesson_sections,
          lesson_sections_completed: 0,
          status: 'not_started',
          completed_at: null,
        })),
      );

      await this.enrollmentLessonSectionsService.createMany(
        createdEnrollmentLessons.map(enrollmentLesson => {
          const sections = lessonSections.filter(
            section => section.lesson_id.toString() === enrollmentLesson.lesson_id.toString(),
          );

          return sections.map(section => ({
            enrollment_lesson_id: enrollmentLesson.id.toString(),
            lesson_section_id: section.id.toString(),
            status: 'not_started',
            started_at: null,
            completed_at: null,
          }));
        }).flat(),
      );

      const createdEnrollmentQuizzes = await this.enrollmentQuizzesService.createMany(
        quizzes.map(quiz => ({
          enrollment_id: createdEnrollment._id.toString(),
          quiz_id: quiz._id.toString(),
          date_taken: null,
          total_quiz_items: quiz.total_items,
          score: 0,
          comments: '',
          is_submitted: false,
        })),
      );

      await this.enrollmentQuizItemsService.createMany(
        createdEnrollmentQuizzes.map(enrollmentQuiz => {
          const items = quizItems.filter(
            item => item.quiz_id.toString() === enrollmentQuiz.quiz_id.toString(),
          );

          return items.map(item => ({
            enrollment_quiz_id: enrollmentQuiz.id.toString(),
            quiz_item_id: item._id.toString(),
            user_answer: '',
            is_correct: false,
            answered_at: null,
          }));
        }).flat()
      )

      return createdEnrollment;
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create enrollment',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-current-user')
  async findByCurrentUser(@Req() req: Request) {
    const currentUser = req.user as any;
    const userId = currentUser?.userId;

    const enrollments = await this.enrollmentsService.findByUserId(userId);
    return enrollments;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-current-user-and-course-id/:course_id')
  async findByCurrentUserAndCourse(
    @Param('course_id') course_id: string,
    @Req() req: Request,
  ) {
    const currentUser = req.user as any;
    const userId = currentUser?.userId;

    const enrollments = await this.enrollmentsService.findByUserIdAndCourseId(userId, course_id);
    return enrollments;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-course-id/:course_id')
  async findByCourseId(@Param('course_id') course_id: string) {
    const enrollments = await this.enrollmentsService.findByCourseId(course_id);
    return enrollments;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-user-id/:user_id')
  async findByUserId(@Param('user_id') user_id: string) {
    const enrollments = await this.enrollmentsService.findByUserId(user_id);
    return enrollments;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const enrollment = await this.enrollmentsService.findOne(id);
    return enrollment;
  }
}
