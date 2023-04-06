import { ChatroomEntity } from 'src/entities/chatroom.entity';

export class UserDto {
  id: string;
  username: string;
  chatrooms: ChatroomEntity[];
}
