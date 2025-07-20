import { Repository } from "typeorm";
import {
  Operation,
  OperationStatus,
  TransactionType,
} from "../../entity/Operation";
import { CurrencyEnum } from "../../entity/Merchant";
import { IOperationRepository } from "./operation.repository.interface";

export class OperationRepository implements IOperationRepository {
  constructor(private operationRepository: Repository<Operation>) {}

  async save({
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
  }): Promise<void> {
    const operation = this.operationRepository.create({
      id,
      transactionId,
      status,
      createdAt,
      merchantIban,
      customerPaymentMethodId,
      currency,
      amount,
      type,
    });
    await this.operationRepository.save(operation);
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
  }
  async findByTransactionId(transactionId: string): Promise<Operation[]> {
    return this.operationRepository.find({
      where: { transactionId },
      order: { createdAt: "DESC" },
    });
  }
}
