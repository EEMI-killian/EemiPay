import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752896222426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE public.card_info (
            id CHARACTER VARYING NOT NULL,
            card_number CHARACTER VARYING NOT NULL,
            card_expiry_date TIMESTAMP NOT NULL,
            card_cvv CHARACTER VARYING NOT NULL,
            card_holder_name CHARACTER VARYING NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT pk_card_info PRIMARY KEY (id)
        );`);

    await queryRunner.query(`
            CREATE TYPE operation_type_enum AS ENUM ('CAPTURE', 'REFUND');
            CREATE TYPE operation_status_enum AS ENUM ('PENDING', 'COMPLETED', 'FAILED');
        `);

    await queryRunner.query(`
            ALTER TABLE public.merchant
            ADD COLUMN IF NOT EXISTS iban CHARACTER VARYING;
        `);

    await queryRunner.query(`
            CREATE TABLE public.operation (
            id CHARACTER VARYING NOT NULL,
            transaction_id CHARACTER VARYING NOT NULL,
            operation_type operation_type_enum NOT NULL,
            amount integer NOT NULL,
            currency public.currency_enum NOT NULL,
            status operation_status_enum NOT NULL,
            merchant_iban CHARACTER VARYING NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            card_info_id CHARACTER VARYING NOT NULL,
            CONSTRAINT pk_operation PRIMARY KEY (id),
            CONSTRAINT fk_operation_card_info FOREIGN KEY (card_info_id) REFERENCES public.card_info(id)
        );
        `);

    await queryRunner.query(`
            CREATE INDEX idx_operation_transaction_id ON public.operation(transaction_id);
            CREATE INDEX idx_operation_status ON public.operation(status);
            CREATE INDEX idx_operation_type ON public.operation(operation_type);
            CREATE INDEX idx_operation_created_at ON public.operation(created_at);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX IF EXISTS idx_operation_transaction_id;
            DROP INDEX IF EXISTS idx_operation_status;
            DROP INDEX IF EXISTS idx_operation_type;
            DROP INDEX IF EXISTS idx_operation_created_at;
            DROP INDEX IF EXISTS idx_card_info_user_id;
        `);

    await queryRunner.query(`
            DROP TABLE IF EXISTS public.operation;
        `);

    await queryRunner.query(`
            DROP TYPE IF EXISTS operation_type_enum;
            DROP TYPE IF EXISTS operation_status_enum;
        `);

    await queryRunner.query(`
            ALTER TABLE public.merchant
            DROP COLUMN IF EXISTS iban;
        `);

    await queryRunner.query(`
            DROP TABLE IF EXISTS public.card_info;
        `);
  }
}
