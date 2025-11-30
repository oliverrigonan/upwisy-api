import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthGuard } from './../auth/auth.http-guard';

import { SessionsService } from './sessions.service';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@ApiTags('Sessions')
@Controller('api/sessions')
export class SessionsController {

  constructor(
    private readonly SessionsService: SessionsService
  ) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() createSessionDto: CreateSessionDto) {
    try {
      return await this.SessionsService.create(createSessionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to create  session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  async findAll() {
    return await this.SessionsService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('by--id/:_id')
  async findById(@Param('_id') _id: string) {
    const Sessions = await this.SessionsService.findById(_id);
    if (!Sessions || Sessions.length === 0) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No  sessions found for the specified  ID',
          error: `No  sessions found with  ID ${_id}.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return Sessions;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const Session = await this.SessionsService.findOne(id);
    if (!Session) {
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: ' session not found',
          error: `The  session with ID ${id} does not exist.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return Session;
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateSessionDto: UpdateSessionDto) {
    try {
      const Session = await this.SessionsService.findOne(id);
      if (!Session) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: ' session not found',
            error: `The  session with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.SessionsService.update(id, updateSessionDto);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update  session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const Session = await this.SessionsService.findOne(id);
      if (!Session) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: ' session not found',
            error: `The  session with ID ${id} does not exist.`,
          },
          HttpStatus.NOT_FOUND,
        );
      }

      return this.SessionsService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to remove  session',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
