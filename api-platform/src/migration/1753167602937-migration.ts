import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753167602937 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TYPE public.user_role AS ENUM ('ROLE_USER', 'ROLE_ADMIN');
            ALTER TABLE public.user ADD COLUMN "roles" public.user_role NOT NULL DEFAULT 'ROLE_USER';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TYPE public.user_role;
            ALTER TABLE public.user DROP COLUMN "roles";
        `);
  }
}
