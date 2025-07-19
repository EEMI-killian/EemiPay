import { Column, Entity, PrimaryColumn } from "typeorm";
import { CurrencyEnum } from "./Merchant";

@Entity()
export class Operation {
  @PrimaryColumn({ type: "character varying" })
  id!: string;

  @Column({ name: "transaction_id" })
  transactionId!: string;

  @Column({ name: "operation_type", type: "enum", enum: ["CAPTURE", "REFUND"] })
  type!: "CAPTURE" | "REFUND";

  @Column({ name: "amount" })
  amount!: number;

  @Column({ type: "enum", enum: CurrencyEnum })
  currency!: CurrencyEnum;

  @Column({
    name: "status",
    type: "enum",
    enum: ["PENDING", "COMPLETED", "FAILED"],
  })
  status!: "PENDING" | "COMPLETED" | "FAILED";

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt!: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt!: Date;

  @Column({ name: "merchant_iban" })
  merchantIban!: string;

  @Column({ name: "card_info_id", type: "character varying" })
  cardInfoId!: string;
}
