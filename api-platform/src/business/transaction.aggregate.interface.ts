import { CurrencyEnum } from "../entity/Merchant";

export interface ITransactionAggregate {
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
  }): { success: boolean; message: string } | { error: string };
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
  }): { success: boolean; message: string } | { error: string };
  updateOperationStatus({
    operationId,
    status,
  }: {
    operationId: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
  }): { success: boolean; message: string } | { error: string };
}
