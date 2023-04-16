import { CacheModule, Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { UserEntity } from 'src/entities/user.entity';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChatroomEntity]),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    }),
  ],
  providers: [ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
