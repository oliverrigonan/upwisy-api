import { Module } from '@nestjs/common';

import { CourseUsersService } from './course-users.service';
import { CourseUsersController } from './course-users.controller';

import { DatabaseModule } from './../../database/database.module';
import { CourseUsersModelProvider } from './../../database/schemas/course-users.schema';

@Module({
  controllers: [
    CourseUsersController
  ],
  providers: [
    CourseUsersService,
    CourseUsersModelProvider
  ],
  imports: [DatabaseModule],
})
export class CourseUsersModule { }
