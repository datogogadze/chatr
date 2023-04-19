import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageEntity } from 'src/entities/message.entity';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Post('chatroom/:id')
  getAllMessagesForChatroom(
    @Param('id') id: string,
    @Body() body,
  ): Promise<MessageEntity[]> {
    return this.messageService.getAllMessagesForChatroom(
      id,
      body.oldest_message_timestamp
        ? new Date(body.oldest_message_timestamp)
        : new Date(),
    );
  }
}
