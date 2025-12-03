import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { CoursesModule } from './app/courses/courses.module';
import { LessonsModule } from './app/lessons/lessons.module';
import { LessonSectionsModule } from './app/lesson-sections/lesson-sections.module';
import { SessionsModule } from './app/sessions/sessions.module';
import { FilesModule } from './app/files/files.module';
import { FileContentsModule } from './app/file-contents/file-contents.module';
import { LearningPlansModule } from './app/learning-plans/learning-plans.module';
import { OpenaiModule } from './app/openai/openai.module';
import { UpwisyModule } from './app/upwisy/upwisy.module';
import { QuizzesModule } from './app/quizzes/quizzes.module';
import { QuizItemsModule } from './app/quiz-items/quiz-items.module';
import { EnrollmentsModule } from './app/enrollments/enrollments.module';
import { EnrollmentQuizzesModule } from './app/enrollment-quizzes/enrollment-quizzes.module';
import { EnrollmentQuizItemsModule } from './app/enrollment-quiz-items/enrollment-quiz-items.module';
import { EnrollmentLessonsModule } from './app/enrollment-lessons/enrollment-lessons.module';
import { EnrollmentLessonSectionsModule } from './app/enrollment-lesson-sections/enrollment-lesson-sections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    LessonsModule,
    LessonSectionsModule,
    SessionsModule,
    FilesModule,
    FileContentsModule,
    LearningPlansModule,
    OpenaiModule,
    UpwisyModule,
    QuizzesModule,
    QuizItemsModule,
    EnrollmentsModule,
    EnrollmentQuizzesModule,
    EnrollmentQuizItemsModule,
    EnrollmentLessonsModule,
    EnrollmentLessonSectionsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
