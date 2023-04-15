import { Module } from '@nestjs/common';
import { AppGateway } from './gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, UserEntity])],
  providers: [AppGateway],
})
export class GatewayModule {}
