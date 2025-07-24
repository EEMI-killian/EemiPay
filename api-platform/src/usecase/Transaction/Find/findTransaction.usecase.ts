import { IFindTransactionUseCase } from "./findTransaction.usecase.interface";
import { OperationRepository } from "../../../repository/Operation/operation.repository";
import { TransactionRepository } from "../../../repository/Transaction/transaction.repository";

export interface IFindTransactionUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  success: (transaction: any) => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
}

export class FindTransactionUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> implements
    IFindTransactionUseCase<SuccessType, FunctionalErrorType, NotFoundType>
{
  constructor(
    private readonly operationRepository: OperationRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly presenter: IFindTransactionUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType
    >,
  ) {}

  async execute(transactionId: string): Promise<SuccessType | FunctionalErrorType | NotFoundType> {
    try {
      const transaction = await this.transactionRepository.findById(transactionId);
      if (!transaction) {
        return await this.presenter.notFound();
      }
      const operations  = await this.operationRepository.findByTransactionId(transactionId);
      if (!operations) {
        return await this.presenter.success({
          ...transaction,
          operations: [],
        }
       
        );
      }
      return await this.presenter.success({
        ...transaction,
        operations,
      });
    } catch (error) {
      return await this.presenter.functionalError(error.message);
    }
  }
}
