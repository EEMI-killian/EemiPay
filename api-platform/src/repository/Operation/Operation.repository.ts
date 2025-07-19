import { Repository } from "typeorm";
import { Operation } from "../../entity/Operation";
import { IOperationRepository } from "./Operation.repository.interface";

export class OperationRepository implements IOperationRepository {
  constructor(private operationRepository: Repository<Operation>) {}

  async save(operation: Operation): Promise<void> {
    await this.operationRepository.save(operation);
  }
  async updateStatus(
    operationId: string,
    status: "PENDING" | "COMPLETED" | "FAILED",
    updatedAt: Date,
  ): Promise<void> {
    await this.operationRepository.update(
      { id: operationId },
      { status, updatedAt },
    );
  }
  async findbyTransactionId(
    transactionId: string,
  ): Promise<Operation[] | null> {
    return await this.operationRepository.find({ where: { transactionId } });
  }
}
