import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthModule } from '../auth/auth.module';
import { jwtConstants } from '../auth/constants';
import { EventGateway } from './event.gateway';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: jwtConstants.secret
    })],
  providers: [EventGateway],
  exports: [EventGateway]
})
export class EventModule {}
