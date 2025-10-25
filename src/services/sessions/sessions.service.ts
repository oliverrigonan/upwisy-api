import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { SessionsCollection } from './../../schemas/sessions.schema';
import { Session } from './../../interfaces/session/session.interface';

@Injectable()
export class SessionsService {
    constructor(
        @InjectModel(SessionsCollection.name)
        private readonly sessionsModel: Model<Session>,
    ) { }

    async create(data: Session): Promise<Session> {
        const now = new Date();
        const newSession = new this.sessionsModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newSession.save();
    }

    async findAll(): Promise<Session[]> {
        return this.sessionsModel.find().exec();
    }

    async findOne(id: string): Promise<Session> {
        const session = await this.sessionsModel.findById(id).exec();
        if (!session) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }

        return session;
    }

    async update(id: string, data: Partial<Session>): Promise<Session> {
        data.updated_at = new Date();

        const updatedSession = await this.sessionsModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedSession) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }

        return updatedSession;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.sessionsModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`Session with ID ${id} not found`);
        }

        return true;
    }
}
