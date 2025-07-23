import { Repository } from "typeorm";
import {
  Operation,
  OperationStatus,
  TransactionType,
} from "../../entity/Operation";
import { CurrencyEnum } from "../../entity/Merchant";
import { IOperationRepository } from "./operation.repository.interface";
import mongoose from "mongoose";
import { ModelDocument } from "../../mongoSchema";

export class OperationRepository implements IOperationRepository {
  constructor(private operationRepository: Repository<Operation>) {}

  async save({
    id,
    transactionId,
    createdAt,
    status,
    merchantIban,
    customerPaymentMethodId,
    lastFourDigits,
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
    lastFourDigits: string;
    currency: CurrencyEnum;
    amount: number;
    type: TransactionType;
  }): Promise<void> {
    const operation = this.operationRepository.create({
      id,
      transactionId,
      status,
      createdAt,
      merchantIban,
      customerPaymentMethodId,
      lastFourDigits,
      currency,
      amount,
      type,
    });
    await this.operationRepository.save(operation);
    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    await ModelDocument.findOneAndUpdate(
      {
        "merchant.transactions.transactionId": transactionId,
        "merchant.transactions.operations.operationId": id,
      },
      {
        $set: {
          "merchant.transactions.$[transaction].operations.$[operation].transactionId":
            transactionId,
          "merchant.transactions.$[transaction].operations.$[operation].createdAt":
            createdAt,
          "merchant.transactions.$[transaction].operations.$[operation].status":
            status,
          "merchant.transactions.$[transaction].operations.$[operation].MerchantIban":
            merchantIban,
          "merchant.transactions.$[transaction].operations.$[operation].customerPaymentMethodId":
            customerPaymentMethodId,
          "merchant.transactions.$[transaction].operations.$[operation].currency":
            currency,
          "merchant.transactions.$[transaction].operations.$[operation].amount":
            amount,
          "merchant.transactions.$[transaction].operations.$[operation].type":
            type,
          "merchant.transactions.$[transaction].operations.$[operation].lastFourDigits":
            lastFourDigits,
        },
      },
      {
        arrayFilters: [
          { "transaction.transactionId": transactionId },
          { "operation.operationId": id },
        ],
        new: true,
      },
    );
    await mongoose.disconnect();
  }

  async updateOperationStatus({
    operationId,
    status,
  }: {
    operationId: string;
    status: OperationStatus;
  }): Promise<void> {
    await this.operationRepository.update(operationId, {
      status,
      updatedAt: new Date(),
    });
    await mongoose.connect(
      "mongodb://mongo:mongo@mongodb:27017/eemi-pay?authSource=admin",
    );
    await ModelDocument.findOneAndUpdate(
      {
        "merchant.transactions.operations.operationId": operationId,
      },
      {
        $set: {
          "merchant.transactions.$[transaction].operations.$[operation].status":
            status,
        },
      },
      {
        arrayFilters: [
          { "transaction.operations.operationId": operationId },
          { "operation.operationId": operationId },
        ],
        new: true,
      },
    );
    await mongoose.disconnect();
  }
  async findByTransactionId(transactionId: string): Promise<Operation[]> {
    return this.operationRepository.find({
      where: { transactionId },
      order: { createdAt: "DESC" },
    });
  }
}
