import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

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
  async handleMessage(@MessageBody() message: MessageEntity) {
    const existingUser = await this.userRepository.findOne({
      where: { id: message.sender_id },
    });

    if (!existingUser) {
      throw new BadRequestException(`User doesn't exist ${message.sender_id}`);
    }

    const inChatroom = existingUser.chatrooms.some(
      (c) => c.id === message.chatroom_id,
    );
    if (!inChatroom) {
      throw new BadRequestException(
        `User not in chatroom ${message.chatroom_id}`,
      );
    }
    await this.messageRepository.save(message);
    this.server.to(message.chatroom_id).emit('message', message);
  }
}
