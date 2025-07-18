import { CurrencyEnum } from "../../entity/Merchant";

export interface ITransactionRepository {
  save(transaction: {
    id: string;
    merchantId: string;
    externalRef: string;
    amount: number;
    currency: CurrencyEnum;
  }): Promise<void>;
}
