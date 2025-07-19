import { Repository } from "typeorm";
import { CurrencyEnum } from "../../entity/Merchant";
import { Transaction } from "../../entity/Transaction";

export class TransactionRepository {
  updateTransactionStatus(id: string, arg1: string, arg2: Date) {
    throw new Error("Method not implemented.");
  }
  constructor(private transactionRepository: Repository<Transaction>) {
    this.transactionRepository = transactionRepository;
  }
  async save({
    id,
    merchantId,
    externalRef,
    amount,
    currency,
    createdAt,
  }: {
    id: string;
    merchantId: string;
    externalRef: string;
    amount: number;
    currency: CurrencyEnum;
    createdAt: Date;
  }): Promise<void> {
    await this.transactionRepository.save({
      id,
      merchantId,
      externalRef,
      amount,
      currency,
      createdAt,
    });
  }
  async findById(id: string): Promise<Transaction | null> {
    return await this.transactionRepository.findOne({ where: { id } });
  }
}
