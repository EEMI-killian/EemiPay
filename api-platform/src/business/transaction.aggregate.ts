import { v4 as uuidv4 } from "uuid";
import { CurrencyEnum } from "../entity/Merchant";

export type operation = {
  id: string;
  type: "CAPTURE" | "REFUND";
  amount: number;
  currency: CurrencyEnum;
  customerCardInfo: cardInfo;
  createdAt: Date;
  updatedAt: Date;
  merchantIban: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
};

export type cardInfo = {
  cardNumber: string;
  cardHolderName: string;
  expiryDate: Date;
  cvv: string;
};

export type transactionDto = {
  id: string;
  merchantId: string;
  externalRef: string;
  amount: number;
  currency: CurrencyEnum;
  createdAt: string;
  operations: operation[];
};

export class TransactionAggregate {
  constructor(
    public readonly id: string,
    public readonly merchantId: string,
    public readonly externalRef: string,
    public readonly amount: number,
    public readonly currency: CurrencyEnum,
    public readonly createdAt: Date,
    public readonly operations: operation[],
  ) {}

  addOperation({
    type,
    amount,
    currency,
    customerCardInfo,
    merchantIban,
  }: {
    type: "CAPTURE" | "REFUND";
    amount: number;
    currency: CurrencyEnum;
    customerCardInfo: cardInfo;
    merchantIban: string;
  }): { success: boolean; message: string } | { error: string } {
    if (type === "REFUND") {
      if (this.operations.length === 0) {
        return { error: "Cannot refund without a capture operation." };
      }
      const initialCapture = this.operations.find(
        (op) => op.type === "CAPTURE" && op.status === "COMPLETED",
      );
      if (!initialCapture) {
        return { error: "No capture operation found to refund against." };
      }
      const totalRefunded = this.operations
        .filter(
          (op) =>
            op.type === "REFUND" &&
            (op.status === "COMPLETED" || op.status === "PENDING"),
        )
        .reduce((sum, op) => sum + op.amount, 0);
      if (totalRefunded + amount > initialCapture.amount) {
        return { error: "Refund amount exceeds the initial capture amount." };
      }
      this.operations.push({
        id: `operation-${uuidv4()}`,
        type,
        amount,
        currency,
        customerCardInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
        merchantIban: merchantIban,
        status: "PENDING",
      });

      return { success: true, message: "Refund operation added successfully." };
    }
    if (amount <= 0) {
      return { error: "Amount must be greater than zero." };
    }
    this.operations.push({
      id: `operation-${uuidv4()}`,
      type,
      amount,
      currency,
      customerCardInfo,
      createdAt: new Date(),
      updatedAt: new Date(),
      merchantIban: merchantIban,
      status: "PENDING",
    });
    return { success: true, message: "Capture operation added successfully." };
  }

  updateOperationStatus({
    operationId,
    status,
  }: {
    operationId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
  }): { success: boolean; message: string } | { error: string } {
    const operation = this.operations.find((op) => op.id === operationId);
    if (!operation) {
      return { error: "Operation not found." };
    }
    operation.status = status;
    operation.updatedAt = new Date();
    return { success: true, message: "Operation status updated successfully." };
  }

  toDto(): transactionDto {
    return {
      id: this.id,
      merchantId: this.merchantId,
      externalRef: this.externalRef,
      amount: this.amount,
      currency: this.currency,
      createdAt: this.createdAt.toISOString(),
      operations: this.operations.map((op) => ({
        id: op.id,
        type: op.type,
        amount: op.amount,
        currency: op.currency,
        customerCardInfo: op.customerCardInfo,
        createdAt: op.createdAt,
        updatedAt: op.updatedAt,
        merchantIban: op.merchantIban,
        status: op.status,
      })),
    };
  }
}
