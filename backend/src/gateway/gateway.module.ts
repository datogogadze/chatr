import { CacheModule, Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { UserEntity } from 'src/entities/user.entity';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity, UserEntity]),
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
  providers: [AppGateway],
})
export class GatewayModule {}
