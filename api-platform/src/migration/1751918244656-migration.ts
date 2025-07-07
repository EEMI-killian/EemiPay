import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1751918244656 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.merchant_contact (
                "id" SERIAL NOT NULL,
                "first_name" character varying NOT NULL,
                "last_name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "phone_number" character varying NOT NULL,
                "merchant_id" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "UQ_merchant_contact_phone_number" UNIQUE ("phone_number"),
                CONSTRAINT "UQ_merchant_contact_email" UNIQUE ("email"),
                CONSTRAINT "PK_merchant_contact_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_merchant_contact_merchant" FOREIGN KEY ("merchant_id") REFERENCES public.merchant("id") ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE public.merchant_contact;`);
  }
}
