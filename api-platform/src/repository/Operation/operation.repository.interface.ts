import { CurrencyEnum } from "../../entity/Merchant";
import { OperationStatus, TransactionType } from "../../entity/Operation";

export interface IOperationRepository {
  save({
    id,
    createdAt,
    status,
    merchantIban,
    customerPaymentMethodId,
    currency,
    amount,
    type,
  }: {
    id: string;
    createdAt: Date;
    status: OperationStatus;
    merchantIban: string;
    customerPaymentMethodId: string;
    currency: CurrencyEnum;
    amount: number;
    type: TransactionType;
  }): Promise<void>;
}
