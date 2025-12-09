import { Injectable } from '@nestjs/common';

import { Socket } from 'socket.io';

import { UserDocument, UsersService } from '../users/users.service';

@Injectable()
export class UpwisyService {

  constructor(
    private readonly usersService: UsersService,
  ) { }

  matchesClassShape<T extends object>(obj: any, classRef: new () => T): boolean {
    if (!obj || typeof obj !== 'object') return false;

    const instance = new classRef();
    const classKeys = Object.keys(instance);

    for (const key of classKeys) {
      if (!(key in obj)) {
        return false;
      }
    }

    return true;
  }

  async getCurrentUser(socket: Socket): Promise<UserDocument | null> {
    const currentUser = socket.data.user;
    if (!currentUser?.email) {
      socket.emit('error', 'User email not found.');
      return null;
    }

    const user = await this.usersService.findOneByEmail(currentUser.email);
    if (!user) {
      socket.emit('error', 'User not found.');
      return null;
    }

    return user;
  }
}
