import { UseFilters, UseGuards } from '@nestjs/common';
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

import { WsJwtAuthGuard } from '../auth/ws-jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { Event } from './event.model';

@UseGuards(WsJwtAuthGuard)
@UseFilters(new BaseWsExceptionFilter())
@WebSocketGateway(3001)
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(
    private wsJwtAuthGuard: WsJwtAuthGuard,
    private usersService: UsersService
    ) {
  }

  afterInit(server: Server) {
  }
  
  async handleConnection(client: Socket, ...args: any[]) {
    // Get user
    const user = this.wsJwtAuthGuard.verify(client);

    if (!user) {
      client.disconnect(true);
      return;
    }

    // Join company room
    client.join(user.companyId);

    this.usersService.setConnected(user, client);
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