import { MigrationInterface, QueryRunner } from 'typeorm';

export class createChatroomsUsersTable1680807465947
  implements MigrationInterface
{
  name = 'createChatroomsUsersTable1680807465947';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE chatrooms_users (
            id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
            user_id UUID NOT NULL,
            chatroom_id UUID NOT NULL,
            CONSTRAINT fk_chatrooms_users_user
            FOREIGN KEY(user_id)
                REFERENCES users(id),
            CONSTRAINT fk_chatrooms_users_chatroom
            FOREIGN KEY(chatroom_id)
                REFERENCES chatrooms(id)
    )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE chatrooms_users`);
  }
}
