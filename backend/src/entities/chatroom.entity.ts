import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chatroom")
export class ChatroomEntity {
    @PrimaryGeneratedColumn()
    public id: number;
    
    @Column()
    public name: string;

    @Column()
    public creator_id: number;
    
    @Column()
    public description: string;
    
    @Column()
    public created_at: Date;
}