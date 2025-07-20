import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752852624106 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.transaction (
                "id" character varying NOT NULL,
                "merchant_id" character varying NOT NULL,
                "external_ref" character varying NOT NULL,
                "amount" integer NOT NULL,
                "currency" public.currency_enum NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE public.transaction;
        `);
  }
}
