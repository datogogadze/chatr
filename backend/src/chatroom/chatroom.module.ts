import { CacheModule, Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { UserEntity } from 'src/entities/user.entity';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChatroomEntity]),
    CacheModule.register([
      {
        store: redisStore,
        url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      },
      {
        store: redisStore,
        url: `redis://${process.env.REDIS_HOST2}:${process.env.REDIS_PORT2}`,
      },
    ]),
  ],
  providers: [ChatroomService],
  controllers: [ChatroomController],
})
export class ChatroomModule {}
