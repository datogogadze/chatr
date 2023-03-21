import { MigrationInterface, QueryRunner } from 'typeorm';

export class messagesTable1679415103414 implements MigrationInterface {
  name = 'messagesTable1679415103414';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE messages (
              id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
              text VARCHAR (256),
              sender_id UUID,
              chatroom_id UUID,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW(),
              CONSTRAINT fk_message_chatroom
                  FOREIGN KEY(chatroom_id) 
                      REFERENCES chatrooms(id),
              CONSTRAINT fk_message_user
                  FOREIGN KEY(sender_id) 
                      REFERENCES users(id)
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE messages;`);
  }
}
