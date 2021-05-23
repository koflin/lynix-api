import { UseFilters } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from 'src/models/user.model';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Event } from './event.model';

@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway(3001)
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    private usersService: UsersService,
    private authGuard: JwtAuthGuard
    ) {
  }

  afterInit(server: Server) {
  }
  
  async handleConnection(client: Socket, ...args: any[]) {
    // Get user
    const { account, type } = await this.authGuard.authenticate(null, client);

    if (!account) {
      client.disconnect(true);
      return;
    }

    if (type === 'user') {
      // Join company room
      client.join(account.companyId);

      this.usersService.setConnected(account, client);
    }
  }
  
  handleDisconnect(client: Socket) {
    this.usersService.setDisconnected(client);
  }

  @SubscribeMessage(Event.ACTIVITY_CHANGE)
  handleGuideTick(client: Socket, data: any) {
    this.usersService.setActivity(this.usersService.getIdFromSocket(client), data);
  }


  trigger(event: Event, user: User | string, data?: any) {
    let activeUser = this.usersService.getConnected(user); 

    if (activeUser) {
      this.server.in(activeUser.user.companyId).emit(event.valueOf().toString(), data);
    }
  }

  triggerOther(event: Event, user: User | string, data?: any) {
    let activeUser = this.usersService.getConnected(user);

    if (activeUser) {
      activeUser.client.broadcast.to(activeUser.user.companyId).emit(event.toString(), data);
    }
  }
}