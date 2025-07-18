import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { CurrencyEnum } from "./Merchant";

@Entity()
export class Transaction {
  @PrimaryColumn({ type: "character varying" })
  id!: string;

  @Column({ name: "merchant_id" })
  merchantId!: string;

  @Column({ name: "external_ref" })
  externalRef!: string;

  @Column({ name: "amount" })
  amount!: number;

  @Column({
    type: "enum",
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;
}
