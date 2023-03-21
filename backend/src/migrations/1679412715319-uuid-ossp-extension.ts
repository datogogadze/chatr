import { MigrationInterface, QueryRunner } from 'typeorm';

export class uuidOsspExtension1679412715319 implements MigrationInterface {
  name = 'uuidOsspExtension1679412715319';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
  }
}
