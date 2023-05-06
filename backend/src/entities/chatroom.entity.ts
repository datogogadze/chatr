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
import { BigIntTransformer } from 'src/utils/transformers';

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

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public created_at: number;

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public updated_at: number;

  @OneToMany(() => MessageEntity, (message) => message.chatroom)
  @JoinColumn({ name: 'message_id' })
  messages: MessageEntity[];

  @ManyToMany(() => UserEntity, (user) => user.chatrooms)
  public users: UserEntity[];
}
