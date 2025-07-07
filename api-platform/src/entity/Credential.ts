import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Credential {
  @PrimaryColumn({ type: "character varying" })
  id!: string;

  @Column({ name: "merchant_id" })
  merchantId!: string;

  @Column({ name: "app_secret" })
  appSecret!: string;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;
}
