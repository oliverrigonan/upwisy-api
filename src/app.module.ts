import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './app/auth/auth.module';
import { UsersModule } from './app/users/users.module';
import { CoursesModule } from './app/courses/courses.module';
import { CourseLessonsModule } from './app/course-lessons/course-lessons.module';
import { CourseSessionsModule } from './app/course-sessions/course-sessions.module';
import { CourseUsersModule } from './app/course-users/course-users.module';
import { AssessmentsModule } from './app/assessments/assessments.module';
import { AssessmentItemsModule } from './app/assessment-items/assessment-items.module';
import { FilesModule } from './app/files/files.module';
import { FileContentsModule } from './app/file-contents/file-contents.module';
import { LearningPlansModule } from './app/learning-plans/learning-plans.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    CoursesModule,
    CourseLessonsModule,
    CourseSessionsModule,
    CourseUsersModule,
    AssessmentsModule,
    AssessmentItemsModule,
    FilesModule,
    FileContentsModule,
    LearningPlansModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
