import { Operation } from "../../entity/Operation";

export interface IOperationRepository {
  save(operation: Operation): Promise<void>;
  updateStatus(
    operationId: string,
    status: "PENDING" | "COMPLETED" | "FAILED",
    updatedAt: Date,
  ): Promise<void>;
  findbyTransactionId(transactionId: string): Promise<Operation[] | null>;
}
