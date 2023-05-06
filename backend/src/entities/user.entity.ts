import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatroomEntity } from './chatroom.entity';
import { BigIntTransformer } from 'src/utils/transformers';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public username: string;

  @Column()
  public email: string;

  @Column()
  public password: string;

  @Column()
  public refresh_token: string;

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public created_at: number;

  @Column({ type: 'bigint', transformer: new BigIntTransformer() })
  public updated_at: number;

  @ManyToMany(() => ChatroomEntity, (chatroom) => chatroom.users, {
    eager: true,
  })
  @JoinTable({
    name: 'chatrooms_users',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
  })
  chatrooms: ChatroomEntity[];
}
