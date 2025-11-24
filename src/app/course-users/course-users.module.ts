import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { CourseUsersService } from './course-users.service';
import { CourseUsersController } from './course-users.controller';

import { DatabaseModule } from './../../database/database.module';
import { CourseUsersSchema } from 'src/database/schemas/course-users.schema';

@Module({
  controllers: [
    CourseUsersController
  ],
  providers: [
    CourseUsersService,
    {
      provide: 'COURSE_USERS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('course_users', CourseUsersSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class CourseUsersModule { }
