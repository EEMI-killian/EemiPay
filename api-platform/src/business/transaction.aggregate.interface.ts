import { CurrencyEnum } from "../entity/Merchant";
import { OperationStatus } from "../entity/Operation";

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
    status: OperationStatus;
  }): { success: boolean; message: string } | { error: string };
}
