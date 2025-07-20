import { Column, Entity, PrimaryColumn } from "typeorm";
import { CurrencyEnum } from "./Merchant";

@Entity()
export class Operation {
  @PrimaryColumn()
  id: string;

  @Column({
    type: "enum",
    enum: ["CAPTURE", "REFUND"],
  })
  type: "CAPTURE" | "REFUND";

  @Column()
  amount: number;

  @Column({
    type: "enum",
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column()
  customerPaymentMethodId: string;

  @Column()
  merchantIban: string;

  @Column({
    type: "enum",
    enum: ["PENDING", "COMPLETED", "FAILED"],
  })
  status: "PENDING" | "COMPLETED" | "FAILED";

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
