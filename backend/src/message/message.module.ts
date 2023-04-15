import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { ChatroomEntity } from 'src/entities/chatroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ChatroomEntity])],
  providers: [MessageService],
  controllers: [MessageController],
})
export class MessageModule {}
