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
  }): Promise<void> {
    const operation = this.operationRepository.create({
      id,
      status,
      createdAt,
      merchantIban,
      customerPaymentMethodId,
      currency,
      amount,
      type, // Assuming the type is always CAPTURE for this operation
    });
    await this.operationRepository.save(operation);
  }
}
