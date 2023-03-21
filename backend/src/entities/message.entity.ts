import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  public id: string;

  @Column()
  public text: string;

  @Column()
  public sender_id: string;

  @Column()
  public chatroom_id: string;

  @Column()
  public created_at: Date;

  @Column()
  public updated_at: Date;
}
