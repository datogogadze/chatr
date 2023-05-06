import { MigrationInterface, QueryRunner } from 'typeorm';

export class messagesCreatedAtIndex1681668237934 implements MigrationInterface {
  name = 'messagesCreatedAtIndex1681668237934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX messages_created_at_idx ON messages (created_at);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX messages_created_at_idx`);
  }
}
