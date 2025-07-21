import { Repository } from "typeorm";
import { CurrencyEnum } from "../../entity/Merchant";
import { Transaction } from "../../entity/Transaction";
import mongoose from "mongoose";
import { ModelDocument } from "../../mongoSchema";
import { tr } from "@faker-js/faker/.";

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
    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    const transactionData = {
      transactionId: id,
      merchantId,
      externalRef,
      amount,
      currency,
      createdAt,
    };

    await ModelDocument.findOneAndUpdate(
      { "merchant.merchantId": merchantId },
      {
        $push: {
          "merchant.transactions": transactionData,
        },
      },
      { new: true },
    );

    await mongoose.disconnect();
  }
  async findById(transactionId: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id: transactionId },
    });
  }
}
