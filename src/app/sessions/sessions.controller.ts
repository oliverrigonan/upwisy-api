import { Controller, Get, Post, Param, HttpException, HttpStatus, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import type { Request } from 'express';

import { AuthGuard } from './../auth/auth.http-guard';

import { SessionsService } from './sessions.service';

import { CreateSessionDto } from './dto/create-session.dto';

@ApiTags('Sessions')
@Controller('api/sessions')
export class SessionsController {

  constructor(
    private readonly sessionsService: SessionsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post("open-session/:enrollment_id")
  async openSession(
    @Param('enrollment_id') enrollment_id: string,
    @Req() req: Request,
  ) {
    try {
      const currentUser = req.user as any;
      const userId = currentUser?.userId;

      const createSessionDto: CreateSessionDto = {
        user_id: userId,
        enrollment_id: enrollment_id,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        duration_seconds: 0,
      };

      return await this.sessionsService.create(createSessionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by-enrollment-id/:enrollment_id')
  async findById(@Param('enrollment_id') enrollment_id: string) {
    const sessions = await this.sessionsService.findByEnrollmentId(enrollment_id);
    return sessions;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const session = await this.sessionsService.findOne(id);
    if (!session) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Session not found',
          error: `The session with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return session;
  }
}
