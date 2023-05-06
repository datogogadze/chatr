import { MigrationInterface, QueryRunner } from 'typeorm';

export class usersTable1679415015713 implements MigrationInterface {
  name = 'usersTable1679415015713';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
              id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4() PRIMARY KEY,
              username VARCHAR (32) NOT NULL UNIQUE,
              email VARCHAR (256) NOT NULL UNIQUE,
              password VARCHAR (256) NOT NULL,
              refresh_token VARCHAR (256),
              created_at BIGINT DEFAULT extract(epoch from now()) * 1000,
              updated_at BIGINT DEFAULT extract(epoch from now()) * 1000
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users;`);
  }
}
