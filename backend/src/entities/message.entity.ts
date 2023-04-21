import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatroomEntity } from './chatroom.entity';
import { BigIntTransformer } from 'src/utils/transformers';

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

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public created_at: number;

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public updated_at: number;

  @ManyToOne(() => ChatroomEntity, (chatroom) => chatroom.messages)
  @JoinColumn({ name: 'chatroom_id' })
  chatroom: ChatroomEntity;
}
