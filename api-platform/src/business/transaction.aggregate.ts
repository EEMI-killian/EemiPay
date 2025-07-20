import { v4 as uuidv4 } from "uuid";
import { ITransactionAggregate } from "./transaction.aggregate.interface";
import { CurrencyEnum } from "../entity/Merchant";
import { OperationStatus, TransactionType } from "../entity/Operation";

type operation = {
  id: string;
  type: TransactionType;
  amount: number;
  currency: CurrencyEnum;
  customerCardInfo: {
    cardNumber: string;
    cardHolderName: string;
    expiryDate: string;
    cvv: string;
  };
  merchantIban: string;
  status: OperationStatus;
  createdAt: Date;
  updatedAt?: Date;
};

export class TransactionAggregate implements ITransactionAggregate {
  constructor(
    public readonly id: string,
    public readonly merchantId: string,
    public readonly externalRef: string,
    public readonly amount: number,
    public readonly currency: CurrencyEnum,
    public readonly createdAt: Date,
    public operations: operation[],
  ) {}
  capture({
    amount,
    currency,
    customerCardInfo,
    merchantIban,
  }: {
    amount: number;
    currency: CurrencyEnum;
    customerCardInfo: {
      cardNumber: string;
      cardHolderName: string;
      expiryDate: string;
      cvv: string;
    };
    merchantIban: string;
  }): { success: boolean; message: string } | { error: string } {
    if (amount <= 0) {
      return { error: "Amount must be greater than 0." };
    }
    if (currency !== this.currency) {
      return { error: "Currency mismatch." };
    }
    if (amount > this.amount) {
      return { error: "Amount exceeds transaction limit." };
    }
    const capturedAmount = this.operations.reduce((acc, op) => {
      if (op.type === "CAPTURE" && op.status === "COMPLETED") {
        return acc + op.amount;
      }
      return acc;
    }, 0);
    if (capturedAmount + amount > this.amount) {
      return { error: "Total captured amount exceeds transaction limit." };
    }
    const operation: operation = {
      id: uuidv4(),
      type: TransactionType.CAPTURE,
      amount,
      currency,
      customerCardInfo,
      merchantIban,
      status: OperationStatus.PENDING,
      createdAt: new Date(),
    };
    this.operations.push(operation);

    return {
      success: true,
      message: "Transaction captured successfully.",
    };
  }
  refund({
    amount,
    currency,
    customerCardInfo,
    merchantIban,
  }: {
    amount: number;
    currency: CurrencyEnum;
    customerCardInfo: {
      cardNumber: string;
      cardHolderName: string;
      expiryDate: string;
      cvv: string;
    };
    merchantIban: string;
  }): { success: boolean; message: string } | { error: string } {
    //can't refund more than captured amount
    const captureOperation = this.operations.find(
      (op) => op.type === "CAPTURE" && op.status === "COMPLETED",
    );
    if (!captureOperation) {
      return { error: "No capture operation found to refund against." };
    }
    if (amount <= 0) {
      return { error: "Amount must be greater than 0." };
    }
    if (currency !== this.currency) {
      return { error: "Currency mismatch." };
    }
    if (amount > captureOperation.amount) {
      return { error: "Refund amount exceeds captured amount." };
    }
    const refundedAmount = this.operations.reduce((acc, op) => {
      if (op.type === "REFUND" && op.status === "COMPLETED") {
        return acc + op.amount;
      }
      return acc;
    }, 0);
    if (refundedAmount + amount > this.amount) {
      return { error: "Total refunded amount exceeds transaction limit." };
    }
    const operation: operation = {
      id: uuidv4(),
      type: TransactionType.REFUND,
      amount,
      currency,
      customerCardInfo,
      merchantIban,
      status: OperationStatus.PENDING,
      createdAt: new Date(),
    };
    this.operations.push(operation);

    return {
      success: true,
      message: "Transaction refunded successfully.",
    };
  }
  updateOperationStatus({
    operationId,
    status,
  }: {
    operationId: string;
    status: OperationStatus;
  }): { success: boolean; message: string } | { error: string } {
    const operation = this.operations.find((op) => op.id === operationId);
    if (!operation) {
      return { error: "Operation not found." };
    }
    operation.status = status;
    operation.updatedAt = new Date();
    return { success: true, message: "Operation status updated successfully." };
  }
}
