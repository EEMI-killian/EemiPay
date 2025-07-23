import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1753277864888 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public.operation ADD "last_four_digits" character varying(4) NOT NULL;
        `);
    
    }

        public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE public.operation DROP COLUMN "last_four_digits";
        `);
        }

}
