import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  UseGuards,
} from '@nestjs/common';
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
import { Cache } from 'cache-manager';

const BATCH_SIZE = 5;

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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly entityManager: EntityManager,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getExistingUser(client: CustomSocket, message: MessageEntity) {
    let existingUser: UserEntity = await this.cacheManager.get(client.user.sub);

    if (!existingUser) {
      existingUser = await this.userRepository.findOne({
        where: { id: client.user.sub },
      });

      if (!existingUser) {
        throw new BadRequestException(
          `User doesn't exist ${message.sender_id}`,
        );
      }
    }
    this.cacheManager.set(client.user.sub, existingUser, 60000);
    return existingUser;
  }

  async validateUser(client: CustomSocket, message) {
    if (!client.user) {
      client.disconnect();
    }

    if (client.user.sub != message.sender_id) {
      throw new BadRequestException(`Incorrect sender ${message.sender_id}`);
    }

    return await this.getExistingUser(client, message);
  }

  async validateChatroom(user, message) {
    const inChatroom = user.chatrooms.some((c) => c.id === message.chatroom_id);

    if (!inChatroom) {
      throw new BadRequestException(
        `User not in chatroom ${message.chatroom_id}`,
      );
    }
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: CustomSocket,
    @MessageBody() message: MessageEntity,
  ) {
    const user = await this.validateUser(client, message);
    this.validateChatroom(user, message);
    this.handleCacheing(message);
    this.server.to(message.chatroom_id).emit('message', message);
  }

  async handleCacheing(message: MessageEntity) {
    let cached_messages: MessageEntity[] = await this.cacheManager.get(
      message.chatroom_id,
    );

    if (!cached_messages) {
      cached_messages = [];
    }

    cached_messages.push(message);

    if (cached_messages.length >= BATCH_SIZE) {
      try {
        await this.saveMessageBatch(cached_messages);
        cached_messages = [];
      } catch (error) {
        console.log('Error while saving batch', error);
      }
    }
    this.cacheManager.set(message.chatroom_id, cached_messages, 0);
  }

  async saveMessageBatch(messages: MessageEntity[]) {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    await queryRunner.startTransaction();

    try {
      this.entityManager.insert(MessageEntity, messages);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }
}
