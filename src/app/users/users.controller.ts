import { Controller, Get, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('api/users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: `The user with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'User not found',
          error: `The user with email ${email} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
