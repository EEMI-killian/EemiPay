import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751917929192 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE currency_enum AS ENUM (
              'EUR', 'USD', 'GBP'
            );
            CREATE TABLE public.merchant (
                "id" SERIAL NOT NULL,
                "company_name" character varying NOT NULL,
                "redirection_url_confirm" character varying NOT NULL,
                "redirection_url_cancel" character varying NOT NULL,
                "kbis_url" character varying NOT NULL,
                "currency" currency_enum NOT NULL,
                "contact_email" character varying NOT NULL,
                "contact_phone" character varying NOT NULL,
                "contact_first_name" character varying NOT NULL,
                "contact_last_name" character varying NOT NULL,
                "user_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "UQ_merchant_contact_email" UNIQUE ("contact_email"),
                CONSTRAINT "UQ_merchant_company_name" UNIQUE ("company_name"),
                CONSTRAINT "PK_merchant_id" PRIMARY KEY ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP TABLE public.merchant; DROP TYPE currency_enum;`,
    );
  }
}
