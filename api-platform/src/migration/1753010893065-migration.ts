import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753010893065 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
           ALTER TABLE public.Merchant ADD COLUMN IF NOT EXISTS "iban" character varying NOT NULL ;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
              ALTER TABLE public.Merchant DROP COLUMN IF EXISTS "iban";
          `);
  }
}
