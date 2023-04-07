import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { MessageEntity } from './message.entity';

@Entity('chatrooms')
export class ChatroomEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public name: string;

  @Column()
  public creator_id: string;

  @Column()
  public description: string;

  @Column()
  public created_at: Date;

  @OneToMany(() => MessageEntity, (message) => message.chatroom)
  @JoinColumn({ name: 'message_id' })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity, (user) => user.chatrooms)
  public users: UserEntity[];
}
