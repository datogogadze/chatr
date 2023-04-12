import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseDto } from 'src/dto/response.dto';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async getAllChatrooms(): Promise<ChatroomEntity[]> {
    const chatrooms = await this.chatroomRepository.find();
    return chatrooms;
  }

  async findChatrooms(term: string): Promise<ChatroomEntity[]> {
    return this.chatroomRepository.find({
      select: ['id', 'name'],
      where: {
        name: Like(`%${term}%`),
      },
    });
  }

  async addUserToChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomEntity> {
    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new BadRequestException(`User ${userId} not found`);
    }

    const existingChatroom = await this.chatroomRepository.findOne({
      where: { id: chatroomId },
    });

    if (!existingChatroom) {
      throw new BadRequestException(`Chatroom ${chatroomId} not found`);
    }

    await this.userRepository.save({
      id: userId,
      chatrooms: [...existingUser.chatrooms, { id: chatroomId }],
    });

    return existingChatroom;
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
      users: [{ id: userId }],
    });
  }

  async removeUserFromChatroom(userId, roomId): Promise<ChatroomEntity> {
    const existingRoom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new BadRequestException(`Wrong room id ${roomId}`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!existingUser) {
      throw new BadRequestException(`Wrong user id ${userId}`);
    }

    existingUser.chatrooms = existingUser.chatrooms.filter(
      (r) => r.id != roomId,
    );

    await this.userRepository.save(existingUser);

    return existingRoom;
  }
}
