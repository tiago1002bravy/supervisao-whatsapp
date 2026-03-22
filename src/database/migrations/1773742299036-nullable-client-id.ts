import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableClientId1773742299036 implements MigrationInterface {
    name = 'NullableClientId1773742299036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "client_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e"`);
        await queryRunner.query(`ALTER TABLE "messages" ALTER COLUMN "client_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
