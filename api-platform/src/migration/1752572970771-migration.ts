import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752572970771 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "credential" (
                "id" character varying NOT NULL,
                "merchant_id" character varying NOT NULL,
                "app_secret" character varying NOT NULL,
                "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_credential_id" PRIMARY KEY ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "credential";
        `);
  }
}
