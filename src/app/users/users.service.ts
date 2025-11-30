import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @Inject('USERS_MODEL')
    private usersModel: Model<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const hashPassword = await bcrypt.hash(createUserDto.hashed_password, 10);
    const newUser: User = {
      full_name: createUserDto.full_name,
      email: createUserDto.email,
      username: createUserDto.username,
      hashed_password: hashPassword,
      type: "user",
      is_disabled: false,
      photo_url: createUserDto.photo_url,
      google_account_id: createUserDto.google_account_id,
      session_id: null,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const createdUser = new this.usersModel(newUser);
    return await createdUser.save();
  }

  async findAll() {
    return await this.usersModel.find().exec();
  }

  async findOne(id: string) {
    return await this.usersModel.findById(id).exec();
  }

  async findOneByGoogleAccountId(google_account_id: string): Promise<User | null> {
    const user = await this.usersModel.findOne({
      google_account_id: google_account_id
    }).exec();

    if (!user) return null;
    return user;
  }

  async findOneByUsername(username: string) {
    return await this.usersModel.findOne({
      username: username
    }).exec();
  }

  async findOneByEmail(email: string) {
    return await this.usersModel.findOne({
      email: email
    }).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const updatedUser: Partial<User> = {
      full_name: updateUserDto.full_name,
    };

    return this.usersModel.findByIdAndUpdate(id, updatedUser, { new: true }).exec();
  }

  remove(id: string) {
    return this.usersModel.findByIdAndDelete(id).exec();
  }
}
