import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Session } from './entities/session.entity';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

@Injectable()
export class SessionsService {

  constructor(
    @Inject('SESSIONS_MODEL')
    private SessionsModel: Model<Session>,
  ) { }

  async create(createSessionDto: CreateSessionDto) {
    const newSession: Session = {
      user_id: createSessionDto.user_id,
      course_id: createSessionDto.course_id,
      lesson_id: createSessionDto.lesson_id,
      start_time: createSessionDto.start_time,
      end_time: createSessionDto.end_time,
      duration_seconds: createSessionDto.duration_seconds,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdSession = new this.SessionsModel(newSession);
    return await createdSession.save();
  }

  async findAll() {
    return await this.SessionsModel.find().exec();
  }

  async findById(_id: string) {
    return await this.SessionsModel.find({
      _id: _id,
    }).exec();
  }

  async findOne(id: string) {
    return await this.SessionsModel.findById(id).exec();
  }

  update(id: string, updateSessionDto: UpdateSessionDto) {
    const updatedSession: Partial<Session> = {
      start_time: updateSessionDto.start_time,
      end_time: updateSessionDto.end_time,
      duration_seconds: updateSessionDto.duration_seconds,
      updated_at: new Date(),
    };

    return this.SessionsModel.findByIdAndUpdate(id, updatedSession, { new: true }).exec();
  }

  remove(id: string) {
    return this.SessionsModel.findByIdAndDelete(id).exec();
  }
}
