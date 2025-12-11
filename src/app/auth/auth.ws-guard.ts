import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService: JwtService
  ) { }

  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient();

    const token = client.handshake.auth.access_token;
    if (!token || typeof token !== 'string') {
      throw new WsException('Missing auth token');
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;

      return true;
    } catch {
      client.emit('error', {
        message: 'Invalid or expired token',
        code: 'AUTH_TOKEN_INVALID'
      });

      throw new WsException('Invalid or expired token');
    }
  }
}