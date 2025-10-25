import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { UsersCollection } from './../../schemas/users.schema';
import { User } from './../../interfaces/user/user.interface';

import { CreateUserDto } from './../../dtos/users/create-user.dto';
import { UpdateUserDto } from './../../dtos/users/update-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UsersCollection.name)
        private readonly usersModel: Model<User>,
    ) { }

    async create(data: CreateUserDto): Promise<User> {
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

    async findOne(id: string): Promise<User | null> {
        const objectId = new Types.ObjectId(id);

        const user = await this.usersModel.findById(objectId).exec();
        if (!user) {
            return null;
        }

        return user;
    }

    async findOneByGoogleAccountId(google_account_id: string): Promise<User | null> {
        const user = await this.usersModel.findOne({ google_account_id }).exec();
        if (!user) {
            return null;
        }

        return user;
    }

    async update(id: string, data: Partial<UpdateUserDto>): Promise<User | null> {
        const updatedUser = await this.usersModel
            .findByIdAndUpdate(id, {
                ...data,
                updated_at: new Date(),
            }, { new: true })
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
