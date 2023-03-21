import { MigrationInterface, QueryRunner } from "typeorm";

export class message1679347131795 implements MigrationInterface {
    name = 'message1679347131795'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table message (
            id int not null unique primary key,
            text varchar (256),
            sender_id int,
            chatroom_id int,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            CONSTRAINT fk_chatroom
                FOREIGN KEY(chatroom_id) 
                    REFERENCES chatroom(id)
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table message;`);
    }

}
