import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UsersCollection } from './../../schemas/users.schema';
import { User } from './../../interfaces/user/user.interface';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersCollection.name)
        private readonly usersModel: Model<User>,
    ) { }

    async create(data: User): Promise<User> {
        const now = new Date();
        const newUser = new this.usersModel({
            ...data,
            created_at: now,
            updated_at: now,
        });

        return newUser.save();
    }

    async findAll(): Promise<User[]> {
        return this.usersModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.usersModel.findById(id).exec();
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async update(id: string, data: Partial<User>): Promise<User> {
        data.updated_at = new Date();

        const updatedUser = await this.usersModel
            .findByIdAndUpdate(id, data, { new: true })
            .exec();

        if (!updatedUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return updatedUser;
    }

    async delete(id: string): Promise<boolean> {
        const result = await this.usersModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return true;
    }
}
