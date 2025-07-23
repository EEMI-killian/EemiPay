import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753273987945 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.merchant
            ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT false ;

            ALTER TABLE public.user
            DROP COLUMN IF EXISTS "is_active" ;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE public.merchant
            DROP COLUMN IF EXISTS "is_active" ;

            ALTER TABLE public.user
            ADD COLUMN IF NOT EXISTS "is_active" boolean NOT NULL DEFAULT false ;
        `);
  }
}
