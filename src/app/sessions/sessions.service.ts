import { Inject, Injectable } from '@nestjs/common';
import { Model, HydratedDocument } from 'mongoose';

import { Session } from './entities/session.entity';

import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';

export type SessionDocument = HydratedDocument<Session>;

@Injectable()
export class SessionsService {

  constructor(
    @Inject('SESSIONS_MODEL')
    private SessionsModel: Model<SessionDocument>,
  ) { }

  async create(createSessionDto: CreateSessionDto) {
    const newSession: Session = {
      user_id: createSessionDto.user_id,
      enrollment_id: createSessionDto.enrollment_id,
      type: createSessionDto.type,
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
    const updatedSession: Partial<Session> = {};

    for (const key in updateSessionDto) {
      if (updateSessionDto[key] !== undefined) {
        updatedSession[key] = updateSessionDto[key];
      }
    }

    updatedSession.updated_at = new Date();

    return this.SessionsModel.findByIdAndUpdate(id, updatedSession, { new: true }).exec();
  }

  remove(id: string) {
    return this.SessionsModel.findByIdAndDelete(id).exec();
  }
}
