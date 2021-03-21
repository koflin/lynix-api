import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from './../users/users.module';
import { EventGateway } from './event.gateway';

@Module({
  imports: [
    AuthModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('jwt.secret')
      })
    }),
    UsersModule
  ],
  providers: [EventGateway],
  exports: [EventGateway],
  controllers: []
})
export class EventModule {}
