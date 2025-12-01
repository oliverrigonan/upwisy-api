import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UsersModelProvider } from './../../database/schemas/users.schema';
import { DatabaseModule } from './../../database/database.module';

import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { GoogleAuthStrategyService } from './google-auth-strategy/google-auth-strategy.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    GoogleAuthStrategyService,
    UsersService,
    UsersModelProvider
  ],
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1Week' },
      }),
    }),
    DatabaseModule
  ]
})
export class AuthModule { }
