import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1679415015713 implements MigrationInterface {
  name = 'usersTable1679415015713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
              id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
              email VARCHAR (256),
              created_at TIMESTAMP DEFAULT NOW(),
              updated_at TIMESTAMP DEFAULT NOW()
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
