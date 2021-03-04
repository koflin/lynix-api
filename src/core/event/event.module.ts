import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/constants';
import { UsersModule } from './../users/users.module';
import { EventGateway } from './event.gateway';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret
    }),
    UsersModule
  ],
  providers: [EventGateway],
  exports: [EventGateway],
  controllers: []
})
export class EventModule {}
