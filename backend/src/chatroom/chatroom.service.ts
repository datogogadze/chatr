import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { UserEntity } from 'src/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class ChatroomService {
  constructor(
    @InjectRepository(ChatroomEntity)
    private readonly chatroomRepository: Repository<ChatroomEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

  async getExistingUser(userId: string) {
    let existingUser: UserEntity = await this.cacheManager.get(userId);

    if (!existingUser) {
      existingUser = await this.userRepository.findOne({
        where: { id: userId },
      });

      if (!existingUser) {
        throw new BadRequestException(`User ${userId} not found`);
      }
    }

    return existingUser;
  }

  async addUserToChatroom(
    userId: string,
    chatroomId: string,
  ): Promise<ChatroomEntity> {
    const existingUser = await this.getExistingUser(userId);
    const existingChatroom = await this.chatroomRepository.findOne({
      where: { id: chatroomId },
    });

    if (!existingChatroom) {
      throw new BadRequestException(`Chatroom ${chatroomId} not found`);
    }
    existingUser.chatrooms.push(existingChatroom);
    this.cacheManager.set(userId, existingUser, 60000);

    await this.userRepository.save({
      id: userId,
      chatrooms: existingUser.chatrooms,
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

    const newChatroom: ChatroomEntity = await this.chatroomRepository.save({
      name,
      description: null,
      creator_id: userId,
      users: [],
    });

    const existingUser = await this.getExistingUser(userId);
    existingUser.chatrooms.push(newChatroom);
    await this.userRepository.save(existingUser);
    this.cacheManager.set(userId, existingUser);
    return newChatroom;
  }

  async removeUserFromChatroom(userId, roomId): Promise<ChatroomEntity> {
    const existingRoom = await this.chatroomRepository.findOne({
      where: { id: roomId },
    });

    if (!existingRoom) {
      throw new BadRequestException(`Wrong room id ${roomId}`);
    }

    const existingUser = await this.getExistingUser(userId);

    existingUser.chatrooms = existingUser.chatrooms.filter(
      (r) => r.id != roomId,
    );

    this.cacheManager.set(userId, existingUser, 60000);

    await this.userRepository.save(existingUser);

    return existingRoom;
  }
}
