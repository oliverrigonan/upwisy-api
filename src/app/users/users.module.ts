import { Module } from '@nestjs/common';
import { Mongoose } from 'mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { DatabaseModule } from './../../database/database.module';
import { UsersSchema } from './../../database/schemas/users.schema';

@Module({
  controllers: [
    UsersController
  ],
  providers: [
    UsersService,
    {
      provide: 'USERS_MODEL',
      useFactory: (mongoose: Mongoose) => mongoose.model('users', UsersSchema),
      inject: ['DATABASE_CONNECTION'],
    }
  ],
  imports: [DatabaseModule],
})
export class UsersModule { }
