import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { ChatroomService } from './chatroom.service';

@Controller('chatroom')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Public()
  @Get()
  getAllChatrooms(): Promise<ChatroomEntity[]> {
    return this.chatroomService.getAllChatrooms();
  }
}
