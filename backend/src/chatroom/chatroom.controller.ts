import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { ChatroomService } from './chatroom.service';
import { getCurrentUserId } from 'src/decorators/get-user-id.decorator';
import { ChatroomSearchDto } from 'src/dto/chatroom-search.dto';
import { AddUserDto } from 'src/dto/chatroom-user.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(private chatroomService: ChatroomService) {}

  @Get()
  getAllChatrooms(): Promise<ChatroomEntity[]> {
    return this.chatroomService.getAllChatrooms();
  }

  @Post('search')
  findChatrooms(@Body() body: ChatroomSearchDto): Promise<ChatroomEntity[]> {
    return this.chatroomService.findChatrooms(body.term);
  }

  @Post('add-user')
  addUserToChatroom(
    @getCurrentUserId() id: string,
    @Body() body: AddUserDto,
  ): Promise<ChatroomEntity> {
    return this.chatroomService.addUserToChatroom(id, body.chatroomId);
  }

  @Post()
  createChatroom(
    @getCurrentUserId() userId,
    @Body() body,
  ): Promise<ChatroomEntity> {
    return this.chatroomService.createChatroom(userId, body.name);
  }

  @Delete('/:id/user')
  removeUserFromChatroom(
    @getCurrentUserId() userId,
    @Param('id') id: string,
  ): Promise<ChatroomEntity> {
    return this.chatroomService.removeUserFromChatroom(userId, id);
  }
}
