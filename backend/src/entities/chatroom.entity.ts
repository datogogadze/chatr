import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
