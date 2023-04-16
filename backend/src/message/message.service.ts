import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllMessagesForChatroom(id: string): Promise<MessageEntity[]> {
    const existingChatroom = await this.chatroomRepository.findOne({
      where: { id },
    });

    if (!existingChatroom) {
      throw new BadRequestException(`Chatroom doesn't exist ${id}`);
    }

    const saved_messages: MessageEntity[] = await this.messageRepository.find({
      where: {
        chatroom_id: id,
      },
    });

    const cached_messages: MessageEntity[] = await this.cacheManager.get(id);
    if (cached_messages) {
      saved_messages.push(...cached_messages);
    }
    return saved_messages;
  }
}
