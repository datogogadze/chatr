import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatroomEntity } from 'src/entities/chatroom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatroomService {

    constructor(
        @InjectRepository(ChatroomEntity)
        private readonly chatroomRepository: Repository<ChatroomEntity>,
    ) {}

    getAllChatrooms(): Promise<ChatroomEntity[]> {
        return this.chatroomRepository.find();
    }

}
