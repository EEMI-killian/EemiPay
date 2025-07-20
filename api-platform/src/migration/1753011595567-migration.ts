import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753011595567 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.payment_method (
                "id" character varying NOT NULL,
                "card_holder_name" character varying NOT NULL,
                "card_number" character varying NOT NULL,
                "expiry_date" character varying NOT NULL,
                "cvv" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_payment_method_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE public.payment_method ;
        `);
  }
}
