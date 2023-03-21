import { Controller, Get } from '@nestjs/common';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Get()
  getAllChatrooms(): Promise<ChatroomEntity[]> {
    return this.chatroomService.getAllChatrooms();
  }
}
