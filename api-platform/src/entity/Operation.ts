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

  @Column({ name: "transaction_id" })
  transactionId: string;

  @Column({
    type: "enum",
    enum: CurrencyEnum,
  })
  currency: CurrencyEnum;

  @Column({ name: "customer_payment_method_id" })
  customerPaymentMethodId: string;

  @Column({ name: "merchant_iban" })
  merchantIban: string;

  @Column({
    type: "enum",
    enum: OperationStatus,
  })
  status: OperationStatus;

  @Column({
    name: "created_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column({
    name: "updated_at",
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;
}
