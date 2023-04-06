import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { MessageEntity } from 'src/entities/message.entity';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected: ', client.id);
  }

  @SubscribeMessage('join')
  handleJoinEvent(client: Socket, room: string) {
    console.log(`Client ${client.id} joined room ${room}`);
    client.join(room);
  }

  @SubscribeMessage('leave')
  handleLeaveEvent(client: Socket, room: string) {
    console.log(`Client ${client.id} left room ${room}`);
    client.leave(room);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() body: MessageEntity) {
    this.server.to(body.chatroom_id).emit('message', body);
  }
}
