import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageEntity } from 'src/entities/message.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
  ) {}

  getAllMessagesForChatroom(id: string): Promise<MessageEntity[]> {
    console.log(id);

    return this.messageRepository.find({
      where: {
        chatroom_id: id,
      },
    });
  }
}
