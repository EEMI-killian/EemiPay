import { CurrencyEnum } from "../../entity/Merchant";
import { Transaction } from "../../entity/Transaction";

export interface ITransactionRepository {
  save(transaction: {
    id: string;
    merchantId: string;
    externalRef: string;
    amount: number;
    currency: CurrencyEnum;
  }): Promise<void>;
  findById(transactionId: string): Promise<Transaction | null>;
}
