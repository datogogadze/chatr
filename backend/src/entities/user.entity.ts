import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatroomEntity } from './chatroom.entity';

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

  @Column()
  public created_at: Date;

  @Column()
  public updated_at: Date;

  @ManyToMany(() => ChatroomEntity, (chatroom) => chatroom.users, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinTable({
    name: 'chatrooms_users',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'chatroom_id', referencedColumnName: 'id' },
  })
  chatrooms: ChatroomEntity[];
}
