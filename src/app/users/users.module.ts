import { Module } from '@nestjs/common';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';

import { DatabaseModule } from './../../database/database.module';
import { UsersModelProvider } from './../../database/schemas/users.schema';

@Module({
  controllers: [
    UsersController
  ],
  providers: [
    UsersService,
    UsersModelProvider
  ],
  imports: [DatabaseModule],
})
export class UsersModule { }
