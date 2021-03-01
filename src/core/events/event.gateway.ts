import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001)
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
  }
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Connected " + client.id);
  }
  handleDisconnect(client: Socket) {
    console.log("Disonnected " + client.id);
  }

  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string) {
    this.server.emit('message', data);
  }
}
