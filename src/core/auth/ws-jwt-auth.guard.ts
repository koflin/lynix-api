import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { LocalUser } from 'src/models/localUser.model';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return this.verify(context.switchToWs().getClient()) != null;
  }

  verify(socket: Socket): LocalUser {
    const token = socket.handshake.auth['token'];
    let user = socket.handshake['user'];

    if (!token || !this.jwtService.verify(token)) {
      return null;
    }

    if (!user) {
      user = this.jwtService.decode(token)['user'];
    }

    return user;
  }
}
