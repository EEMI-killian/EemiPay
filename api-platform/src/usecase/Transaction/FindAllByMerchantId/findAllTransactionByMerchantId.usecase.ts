
import { IFindAllTransactionByMerchantIdUseCase } from "./findAllTransactionByMerchantId.usecase.interface";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";
import { Transaction } from "../../../entity/Transaction";

interface FindAllTransactionByMerchantIdUseCasePresenter<SuccessType, FunctionalErrorType> {
    success(transactions: Transaction[]): SuccessType;
    functionnalError(): FunctionalErrorType;
}

export class FindAllTransactionByMerchantIdUseCase<SuccessType, FunctionalErrorType> implements IFindAllTransactionByMerchantIdUseCase<SuccessType, FunctionalErrorType> {
  constructor(private transactionRepository: ITransactionRepository, private presenter: FindAllTransactionByMerchantIdUseCasePresenter<SuccessType, FunctionalErrorType>) {}

  async execute(merchantId: string): Promise<SuccessType | FunctionalErrorType> {
    try {
      const transactions = await this.transactionRepository.findAllTransactionsByMerchantId(merchantId);
      if (transactions.length === 0) {
        return this.presenter.success([]);
      }
      return this.presenter.success(transactions);
    } catch (error) {
      return this.presenter.functionnalError();
    }
    
  }
}