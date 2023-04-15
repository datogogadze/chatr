import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
  ) {}

  async getAllMessagesForChatroom(id: string): Promise<MessageEntity[]> {
    const existingChatroom = await this.chatroomRepository.findOne({
      where: { id },
    });

    if (!existingChatroom) {
      throw new BadRequestException(`Chatroom doesn't exist ${id}`);
    }

    return this.messageRepository.find({
      where: {
        chatroom_id: id,
      },
    });
  }
}
