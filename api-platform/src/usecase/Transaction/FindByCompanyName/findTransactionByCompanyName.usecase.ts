
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { ITransactionRepository } from "../../../repository/Transaction/transaction.repository.interface";
import { IFindTransactionByCompanyNameUseCase } from "./findTransactionByCompanyName.usecase.interface";

export interface IFindTransactionByCompanyNamePresenter<NotFoundType, SuccessType, FunctionalErrorType> {
  success(transactions: any): Promise<SuccessType>;
  notFound(): Promise<NotFoundType>;
  functionalError(error: string): Promise<FunctionalErrorType>;
}

export class FindTransactionByCompanyNameUseCase<NotFoundType, SuccessType, FunctionalErrorType> implements IFindTransactionByCompanyNameUseCase<SuccessType, FunctionalErrorType, NotFoundType> {
  constructor(
    private merchantRepository: IMerchantRepository,
    private transactionRepository: ITransactionRepository,
    private presenter : IFindTransactionByCompanyNamePresenter<NotFoundType, SuccessType, FunctionalErrorType>
  ) {}

  async execute(companyName: string): Promise<NotFoundType | SuccessType | FunctionalErrorType> {
    try {
        const merchant = await this.merchantRepository.findByCompanyName(companyName);
        if (!merchant) {
            return await this.presenter.notFound();
        }
        const transactions = await this.transactionRepository.findAllTransactionsByMerchantId(merchant.id);

        if (transactions.length === 0) {
            return await this.presenter.success([]);
        }

        return await this.presenter.success(transactions);
    } catch (error) {
        return await this.presenter.functionalError(error.message);
    }
}

}
