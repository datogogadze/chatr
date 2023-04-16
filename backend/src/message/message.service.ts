import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { MessageEntity } from 'src/entities/message.entity';
import { LessThan, Repository } from 'typeorm';
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
    oldest_message_timestamp: Date,
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
      (oldest_message_timestamp &&
        new Date(cached_messages[0].created_at).getTime() >=
          new Date(oldest_message_timestamp).getTime())
    ) {
      cached_messages = [];
    }

    cached_messages.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );

    if (cached_messages.length >= BATCH_SIZE) {
      return cached_messages;
    }

    const FILL_BATCH: number = BATCH_SIZE - cached_messages.length;

    const saved_messages: MessageEntity[] = await this.messageRepository.find({
      where: {
        chatroom_id: id,
        created_at: LessThan(
          oldest_message_timestamp ? oldest_message_timestamp : new Date(),
        ),
      },
      order: {
        created_at: 'ASC',
      },
      take: FILL_BATCH,
    });

    saved_messages.push(...cached_messages);
    return saved_messages;
  }
}
