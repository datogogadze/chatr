import { MigrationInterface, QueryRunner } from 'typeorm';

export class chatroomsTable1679415061533 implements MigrationInterface {
  name = 'chatroomsTable1679415061533';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE chatrooms (
              id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
              name VARCHAR (64) NOT NULL UNIQUE,
              description VARCHAR (256),
              creator_id UUID NOT NULL,
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW(),
              CONSTRAINT fk_chatroom_user
                  FOREIGN KEY(creator_id) 
                      REFERENCES users(id)
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE chatrooms;`);
  }
}
