import { MigrationInterface, QueryRunner } from "typeorm";

export class GoogleTeamRootSync1773800000000 implements MigrationInterface {
    name = 'GoogleTeamRootSync1773800000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "last_polled_at"`);
        await queryRunner.query(`ALTER TABLE "clients" DROP COLUMN "drive_folder_id"`);
        await queryRunner.query(`CREATE TABLE "google_sync_documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "google_file_id" character varying NOT NULL, "doc_title" character varying NOT NULL, "source_folder_id" character varying NOT NULL, "source_folder_name" character varying NOT NULL, "source_path" character varying NOT NULL, "created_time" TIMESTAMP WITH TIME ZONE NOT NULL, "modified_time" TIMESTAMP WITH TIME ZONE NOT NULL, "last_synced_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_78815afcaad5d603f7bc686c5a7" UNIQUE ("google_file_id"), CONSTRAINT "PK_73bc1198512065f20f3e9021285" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "google_sync_documents"`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "drive_folder_id" character varying`);
        await queryRunner.query(`ALTER TABLE "clients" ADD "last_polled_at" TIMESTAMP WITH TIME ZONE`);
    }

}
