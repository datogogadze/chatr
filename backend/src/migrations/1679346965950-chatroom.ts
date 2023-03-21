import { MigrationInterface, QueryRunner } from "typeorm";

export class chatroom1679346965950 implements MigrationInterface {
    name = 'chatroom1679346965950'
   
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`create table chatroom (
            id int not null unique primary key,
            name varchar (64),
            description varchar (256),
            creator_id int,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`drop table chatroom;`);
    }

}
