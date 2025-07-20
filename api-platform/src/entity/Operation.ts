import { Column, Entity, PrimaryColumn } from "typeorm";
import { CurrencyEnum } from "./Merchant";

export enum TransactionType {
  CAPTURE = "CAPTURE",
  REFUND = "REFUND",
}

export enum OperationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

@Entity()
export class Operation {
  @PrimaryColumn()
  id: string;

  @Column({
    type: "enum",
    enum: TransactionType,
  })
  type: TransactionType;

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
    enum: OperationStatus,
  })
  status: OperationStatus;

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
