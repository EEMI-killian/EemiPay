import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753011866189 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE public.transaction_type_enum AS ENUM ('CAPTURE', 'REFUND')
        `);

    await queryRunner.query(`
            CREATE TYPE public.operation_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED')
        `);

    await queryRunner.query(`
            CREATE TABLE public.operation (
                "id" character varying NOT NULL,
                "type" public.transaction_type_enum NOT NULL,
                "amount" integer NOT NULL,
                "currency" public.currency_enum NOT NULL,
                "customer_payment_method_id" character varying NOT NULL,
                "merchant_iban" character varying NOT NULL,
                "status" public.operation_status_enum NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "PK_operation_id" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE public.operation ;
            DROP TYPE public.transaction_type_enum;
            DROP TYPE public.operation_status_enum;
        `);
  }
}
