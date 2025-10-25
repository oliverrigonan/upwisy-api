import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UsersCollection, UsersSchema } from './schemas/users.schema';
import { CoursesCollection, CoursesSchema } from './schemas/courses.schema';
import { CourseLessonsCollection, CourseLessonsSchema } from './schemas/course-lessons.schema';
import { CourseUsersCollection, CourseUsersSchema } from './schemas/course-users.schema';
import { SessionsCollection, SessionsSchema } from './schemas/sessions.schema';
import { FilesCollection, FilesSchema } from './schemas/files.schema';
import { FileContentsCollection, FileContentsSchema } from './schemas/file-contents';
import { LearningPlanCollection, LearningPlanSchema } from './schemas/learning-plan.schema';
import { AssessmentsCollection, AssessmentsSchema } from './schemas/assessments.schema';
import { AssessmentItemsCollection, AssessmentItemsSchema } from './schemas/assessment-items.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || '',
      { dbName: process.env.MONGODB_DB || '' }
    ),
    MongooseModule.forFeature([
      { name: UsersCollection.name, schema: UsersSchema, collection: 'users' },
      { name: CoursesCollection.name, schema: CoursesSchema, collection: 'courses' },
      { name: CourseLessonsCollection.name, schema: CourseLessonsSchema, collection: 'course_lessons' },
      { name: CourseUsersCollection.name, schema: CourseUsersSchema, collection: 'course_users' },
      { name: SessionsCollection.name, schema: SessionsSchema, collection: 'sessions' },
      { name: FilesCollection.name, schema: FilesSchema, collection: 'files' },
      { name: FileContentsCollection.name, schema: FileContentsSchema, collection: 'file_contents' },
      { name: LearningPlanCollection.name, schema: LearningPlanSchema, collection: 'learning_plans' },
      { name: AssessmentsCollection.name, schema: AssessmentsSchema, collection: 'assessments' },
      { name: AssessmentItemsCollection.name, schema: AssessmentItemsSchema, collection: 'assessment_items' }
    ]),
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService
  ],
})
export class AppModule { }
