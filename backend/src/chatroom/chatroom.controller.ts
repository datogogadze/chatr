import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
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

  @Post()
  createChatroom(
    @getCurrentUserId() userId,
    @Body() body,
  ): Promise<ChatroomEntity> {
    return this.chatroomService.createChatroom(userId, body.name);
  }

  @Delete('/:id')
  deleteChatroom(
    @getCurrentUserId() userId,
    @Param('id') id: string,
  ): Promise<ChatroomEntity> {
    return this.chatroomService.deleteChatroom(userId, id);
  }
}
