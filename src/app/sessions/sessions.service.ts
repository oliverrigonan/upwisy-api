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
    return await this.SessionsModel
      .find()
      .populate('user', 'full_name email photo_url created_at updated_at')
      .populate('enrollment')
      .exec();
  }

  async findByEnrollmentId(enrollment_id: string) {
    return await this.SessionsModel
      .find({
        enrollment_id: enrollment_id,
      })
      .populate('user', 'full_name email photo_url created_at updated_at')
      .populate('enrollment')
      .exec();
  }

  async findOne(id: string) {
    return await this.SessionsModel
      .findById(id)
      .populate('user', 'full_name email photo_url created_at updated_at')
      .populate('enrollment')
      .exec();
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
