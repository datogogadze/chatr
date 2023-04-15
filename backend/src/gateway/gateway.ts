import { BadRequestException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { SocketAuthMiddleware } from 'src/auth/ws/ws.middleware';
import { MessageEntity } from 'src/entities/message.entity';
import { UserEntity } from 'src/entities/user.entity';
import { CustomSocket, WsJwtGuard } from 'src/guards/ws.guard';
import { EntityManager, Repository } from 'typeorm';

const BATCH_SIZE = 10;

@WebSocketGateway({
  cors: {
    origin: process.env.CLIENT_URL,
  },
})
@UseGuards(WsJwtGuard)
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
  ) {}

  afterInit(client: CustomSocket) {
    client.use(SocketAuthMiddleware() as any);
  }

  @WebSocketServer()
  server: Server;

  handleConnection(client: CustomSocket) {
    console.log('Client connected: ', client.user.username);
  }

  handleDisconnect(client: CustomSocket) {
    this.saveMessagesInTransaction(client.messages);
    console.log('Client disconnected: ', client.user.username);
  }

  @SubscribeMessage('join')
  handleJoinEvent(client: CustomSocket, room: string) {
    console.log(`Client ${client.user.username} joined room ${room}`);
    client.join(room);
  }

  @SubscribeMessage('leave')
  handleLeaveEvent(client: CustomSocket, room: string) {
    console.log(`Client ${client.user.username} left room ${room}`);
    client.leave(room);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() message: MessageEntity,
  ) {
    console.log(client.user);

    if (!client.user) {
      client.disconnect();
    }

    if (client.user.sub != message.sender_id) {
      throw new BadRequestException(`Incorrect sender ${message.sender_id}`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { id: client.user.sub },
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

    if (client.messages.length < BATCH_SIZE) {
      client.messages.push(message);
    } else {
      this.saveMessagesInTransaction(client.messages);
      client.messages = [];
    }

    console.log(message.chatroom_id, message);

    this.server.to(message.chatroom_id).emit('message', message);
  }

  async saveMessagesInTransaction(messages: MessageEntity[]) {
    if (messages.length === 0) return;
    const queryRunner = this.entityManager.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      for (const message of messages) {
        await this.messageRepository.save(message);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
