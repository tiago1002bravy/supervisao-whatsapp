import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1773716041716 implements MigrationInterface {
    name = 'InitialSchema1773716041716'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "whatsapp_group_id" character varying NOT NULL, "drive_folder_id" character varying, "last_polled_at" TIMESTAMP WITH TIME ZONE, "clickup_list_id" character varying, "alert_whatsapp_number" character varying, "risk_threshold" integer NOT NULL DEFAULT '50', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_0cad8122701d5304f2c34aca70e" UNIQUE ("whatsapp_group_id"), CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "messages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "message_id" character varying NOT NULL, "content" text NOT NULL, "sender_name" character varying, "sender_phone" character varying NOT NULL, "sent_at" TIMESTAMP WITH TIME ZONE NOT NULL, "is_audio" boolean NOT NULL DEFAULT false, "analyzed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_6187089f850b8deeca0232cfeba" UNIQUE ("message_id"), CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "risk_reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "content" text NOT NULL, "risk_score" integer, "messages_count" integer NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_99b4581687451ca53c427b225bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "messages" ADD CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "risk_reports" ADD CONSTRAINT "FK_5f164ce6ae2dc9d5165c58f06c0" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "risk_reports" DROP CONSTRAINT "FK_5f164ce6ae2dc9d5165c58f06c0"`);
        await queryRunner.query(`ALTER TABLE "messages" DROP CONSTRAINT "FK_18df5ffb2002a89c11460d1c66e"`);
        await queryRunner.query(`DROP TABLE "risk_reports"`);
        await queryRunner.query(`DROP TABLE "messages"`);
        await queryRunner.query(`DROP TABLE "clients"`);
    }

}
