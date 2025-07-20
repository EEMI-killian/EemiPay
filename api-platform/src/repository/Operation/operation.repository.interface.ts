import { CurrencyEnum } from "../../entity/Merchant";
import {
  Operation,
  OperationStatus,
  TransactionType,
} from "../../entity/Operation";

export interface IOperationRepository {
  save({
    id,
    transactionId,
    createdAt,
    status,
    merchantIban,
    customerPaymentMethodId,
    currency,
    amount,
    type,
  }: {
    id: string;
    transactionId: string;
    createdAt: Date;
    status: OperationStatus;
    merchantIban: string;
    customerPaymentMethodId: string;
    currency: CurrencyEnum;
    amount: number;
    type: TransactionType;
  }): Promise<void>;
  updateOperationStatus({
    operationId,
    status,
  }: {
    operationId: string;
    status: OperationStatus;
  }): Promise<void>;
  findByTransactionId(transactionId: string): Promise<Operation[]>;
}
