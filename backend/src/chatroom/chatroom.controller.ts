import { Controller, Get } from '@nestjs/common';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { ChatroomService } from './chatroom.service';
import { getCurrentUserId } from 'src/decorators/get-user-id.decorator';

@Controller('chatroom')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Get()
  getAllChatrooms(@getCurrentUserId() userId): Promise<ChatroomEntity[]> {
    return this.chatroomService.getAllChatrooms(userId);
  }
}
