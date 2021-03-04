import { UseFilters, UseGuards } from '@nestjs/common';
import {
  BaseWsExceptionFilter,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
  
  handleConnection(client: Socket, ...args: any[]) {
    // Get user
    const user = this.wsJwtAuthGuard.verify(client);

    console.log("Connected " + client.id + " (" + (user ? user.username + ":" + user.id : "Unknown") + ")");

    if (!user) {
      client.disconnect(true);
      return;
    }

    // Join company room
    client.join(user.companyId);

    this.usersService.setActive(user, client);
  }
  
  handleDisconnect(client: Socket) {
    console.log("Disonnected " + client.id);

    this.usersService.setInactive(client);
  }

  trigger(event: Event, user: User | string, data?: any) {
    let activeUser = this.usersService.getActive(user);

    if (activeUser) {
      activeUser.client.broadcast.to(activeUser.user.companyId).emit(event.toString(), data);
    } else {
      throw new Error("USER NOT ACTIVELY REGISTERED");
    }
  }

  triggerFor(event: Event, filter: { companyId: string }, data?: any) {
    this.server.to(filter.companyId).emit(event.toString(), data);
  }
}