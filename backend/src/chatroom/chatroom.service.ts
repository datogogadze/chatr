import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from 'src/dto/response.dto';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
  ) {}

  getAllChatrooms(userId: string): Promise<ChatroomEntity[]> {
    return this.chatroomRepository.find();
  }

  async createChatroom(userId: string, name: string): Promise<ChatroomEntity> {
    const existingRoom = await this.chatroomRepository.findOne({
      where: { name },
    });

    if (existingRoom) {
      throw new BadRequestException(`Chatroom ${name} already exists`);
    }

    return this.chatroomRepository.save({
      name,
      description: null,
      creator_id: userId,
    });
  }

  async deleteChatroom(userId, roomId): Promise<ChatroomEntity> {
    const existingRoom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new BadRequestException(`Wrong room id ${roomId}`);
    }

    if (existingRoom.creator_id !== userId) {
      throw new ForbiddenException(`User ${userId} can't delete ${roomId}`);
    }

    await this.chatroomRepository.delete(roomId);
    return existingRoom;
  }
}
