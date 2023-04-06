import { MigrationInterface, QueryRunner } from 'typeorm';

export class chatroomNameAndIdIndexes1680807133804
  implements MigrationInterface
{
  name = 'chatroomNameAndIdIndexes1680807133804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE INDEX chatroom_name_idx ON chatrooms (name);`,
    );
    await queryRunner.query(
      `CREATE INDEX chatroom_id_idx ON messages (chatroom_id);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX chatroom_name_idx`);
    await queryRunner.query(`DROP INDEX chatroom_id_idx`);
  }
}
