import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

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

  @ManyToMany(() => UserEntity, (user) => user.chatrooms)
  users: UserEntity[];
}
