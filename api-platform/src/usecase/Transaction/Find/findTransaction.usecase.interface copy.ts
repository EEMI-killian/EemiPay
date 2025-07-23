import { IFindTransactionUseCase } from "./findTransaction.usecase.interface";
import { OperationRepository } from "../../../repository/Operation/operation.repository";

export interface IFindTransactionUseCasePresenter<SuccessType, FunctionalErrorType, NotFoundType> {
  success: (transaction: any) => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
}

export class FindTransactionUseCase<SuccessType, FunctionalErrorType, NotFoundType> implements IFindTransactionUseCase<SuccessType, FunctionalErrorType, NotFoundType> {
  constructor(
    private readonly operationRepository: OperationRepository,
    private readonly presenter: IFindTransactionUseCasePresenter<SuccessType, FunctionalErrorType, NotFoundType>
  ) {}

  async execute(transactionId: string): Promise<any | null> {
    try {
      const transaction = await this.operationRepository.findByTransactionId(transactionId);
      if (!transaction) {
        return await this.presenter.notFound();
      }
      return await this.presenter.success(transaction);
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}