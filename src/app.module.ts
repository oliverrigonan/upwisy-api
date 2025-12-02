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
import { AssessmentsModule } from './app/assessments/assessments.module';
import { AssessmentItemsModule } from './app/assessment-items/assessment-items.module';
import { FilesModule } from './app/files/files.module';
import { FileContentsModule } from './app/file-contents/file-contents.module';
import { LearningPlansModule } from './app/learning-plans/learning-plans.module';
import { OpenaiModule } from './app/openai/openai.module';
import { UpwisyModule } from './app/upwisy/upwisy.module';

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
    AssessmentsModule,
    AssessmentItemsModule,
    FilesModule,
    FileContentsModule,
    LearningPlansModule,
    OpenaiModule,
    UpwisyModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule { }
