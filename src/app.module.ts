import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersCollection, UsersSchema } from './schemas/users.schema';
import { CoursesCollection, CoursesSchema } from './schemas/courses.schema';
import { CourseLessonsCollection, CourseLessonsSchema } from './schemas/course-lessons.schema';
import { CourseUsersCollection, CourseUsersSchema } from './schemas/course-users.schema';
import { SessionsCollection, SessionsSchema } from './schemas/sessions.schema';
import { FilesCollection, FilesSchema } from './schemas/files.schema';
import { FileContentsCollection, FileContentsSchema } from './schemas/file-contents';
import { LearningPlansCollection, LearningPlansSchema } from './schemas/learning-plans.schema';
import { AssessmentsCollection, AssessmentsSchema } from './schemas/assessments.schema';
import { AssessmentItemsCollection, AssessmentItemsSchema } from './schemas/assessment-items.schema';

import { AppController } from './app.controller';
import { UsersController } from './controllers/users/users.controller';
import { CoursesController } from './controllers/courses/courses.controller';
import { CourseLessonsController } from './controllers/course-lessons/course-lessons.controller';
import { CourseUsersController } from './controllers/course-users/course-users.controller';
import { SessionsController } from './controllers/sessions/sessions.controller';
import { FilesController } from './controllers/files/files.controller';
import { FileContentsController } from './controllers/file-contents/file-contents.controller';
import { LearningPlansController } from './controllers/learning-plans/learning-plans.controller';
import { AssessmentsController } from './controllers/assessments/assessments.controller';
import { AssessmentItemsController } from './controllers/assessment-items/assessment-items.controller';

import { AppService } from './app.service';
import { UsersService } from './services/users/users.service';
import { CoursesService } from './services/courses/courses.service';
import { CourseLessonsService } from './services/course-lessons/course-lessons.service';
import { CourseUsersService } from './services/course-users/course-users.service';
import { SessionsService } from './services/sessions/sessions.service';
import { FilesService } from './services/files/files.service';
import { FileContentsService } from './services/file-contents/file-contents.service';
import { LearningPlansService } from './services/learning-plans/learning-plans.service';
import { AssessmentsService } from './services/assessments/assessments.service';
import { AssessmentItemsService } from './services/assessment-items/assessment-items.service';

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
      { name: LearningPlansCollection.name, schema: LearningPlansSchema, collection: 'learning_plans' },
      { name: AssessmentsCollection.name, schema: AssessmentsSchema, collection: 'assessments' },
      { name: AssessmentItemsCollection.name, schema: AssessmentItemsSchema, collection: 'assessment_items' }
    ]),
  ],
  controllers: [
    AppController,
    UsersController,
    CoursesController,
    CourseLessonsController,
    CourseUsersController,
    SessionsController,
    FilesController,
    FileContentsController,
    LearningPlansController,
    AssessmentsController,
    AssessmentItemsController,
  ],
  providers: [
    AppService,
    UsersService,
    CoursesService,
    CourseLessonsService,
    CourseUsersService,
    SessionsService,
    FilesService,
    FileContentsService,
    LearningPlansService,
    AssessmentsService,
    AssessmentItemsService,
  ],
})
export class AppModule { }
