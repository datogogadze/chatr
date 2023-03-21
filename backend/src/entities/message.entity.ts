import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("message")
export class MessageEntity {
    @PrimaryGeneratedColumn()
    public id: string;
    
    @Column()
    public text: string;
    
    @Column()
    public sender_id: number;

    @Column()
    public chatroom_id: number;
    
    @Column()
    public created_at: Date;
}