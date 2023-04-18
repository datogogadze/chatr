import { CacheModule, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, ChatroomEntity]),
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
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
