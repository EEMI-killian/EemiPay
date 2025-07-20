import { Repository } from "typeorm";
import { CurrencyEnum } from "../../entity/Merchant";
import { Transaction } from "../../entity/Transaction";

export class TransactionRepository {
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
  async findById(transactionId: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id: transactionId },
    });
  }
}
