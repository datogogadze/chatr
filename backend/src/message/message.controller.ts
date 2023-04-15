import { Controller, Get, Param } from '@nestjs/common';
import { MessageEntity } from 'src/entities/message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('chatroom/:id')
  getAllMessagesForChatroom(@Param('id') id: string): Promise<MessageEntity[]> {
    return this.messageService.getAllMessagesForChatroom(id);
  }
}
