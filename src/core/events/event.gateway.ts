import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(3001)
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  afterInit(server: Server) {
    console.log("Websocket INIT");
  }
  handleConnection(client: Socket, ...args: any[]) {
    console.log("Connected " + client.id);
  }
  handleDisconnect(client: Socket) {
    console.log("Disonnected " + client.id);
  }

}
