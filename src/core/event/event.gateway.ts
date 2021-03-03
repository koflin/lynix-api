import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LocalUser } from 'src/models/localUser.model';

@WebSocketGateway(3001)
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  public server: Server;

  constructor(private jwtService: JwtService) {
  }

  afterInit(server: Server) {
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Connected " + client.id);
    // Get user
    const user: LocalUser = this.jwtService.verify(client.handshake.auth.token, {
      //ignoreExpiration: true
      ignoreExpiration: true,
    }).user;

    // Join company room
    client.join(user.companyId);

    // Forward events of client to all clients in same company
    client.onAny((event, args) => {
      client.to(user.companyId).broadcast.emit(event, args);
    });
  }
  
  handleDisconnect(client: Socket) {
    console.log("Disonnected " + client.id);
  }

  /*@SubscribeMessage('message')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('message', data);
  }*/
}