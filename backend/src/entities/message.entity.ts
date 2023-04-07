import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatroomEntity } from './chatroom.entity';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public text: string;

  @Column()
  public sender_id: string;

  @Column()
  public sender_name: string;

  @Column()
  public chatroom_id: string;

  @Column()
  public created_at: Date;

  @Column()
  public updated_at: Date;

  @ManyToOne(() => ChatroomEntity, (chatroom) => chatroom.messages)
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatroomEntity;
}
