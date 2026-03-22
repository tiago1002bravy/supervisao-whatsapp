import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRawPayload1773742532588 implements MigrationInterface {
    name = 'AddRawPayload1773742532588'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" ADD "raw_payload" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP COLUMN "raw_payload"`);
    }

}
