import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

const BATCH_SIZE: number = 100;

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllMessagesForChatroom(
    id: string,
    oldest_message_timestamp: number,
  ): Promise<MessageEntity[]> {
    const existingChatroom = await this.chatroomRepository.findOne({
      where: { id },
    });

    if (!existingChatroom) {
      throw new BadRequestException(`Chatroom doesn't exist ${id}`);
    }

    let cached_messages: MessageEntity[] = await this.cacheManager.get(id);

    if (
      !cached_messages ||
      cached_messages.length === 0 ||
      cached_messages[0].created_at >= oldest_message_timestamp
    ) {
      cached_messages = [];
    }

    cached_messages.sort((a, b) => a.created_at - b.created_at);

    if (cached_messages.length >= BATCH_SIZE) {
      return cached_messages;
    }

    const FILL_BATCH: number = BATCH_SIZE - cached_messages.length;

    console.log({ oldest_message_timestamp });

    let saved_messages: MessageEntity[] = await this.messageRepository.find({
      where: {
        chatroom_id: id,
        created_at: LessThan(oldest_message_timestamp),
      },
      order: {
        created_at: 'DESC',
      },
      take: FILL_BATCH,
    });

    saved_messages = saved_messages.reverse();

    saved_messages.push(...cached_messages);

    return saved_messages;
  }
}
