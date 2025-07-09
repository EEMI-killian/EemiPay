import { I } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IDeleteMerchantUseCase } from "./deleteMerchant.usecase.interface";

export type IDeleteMerchantPresenter<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> = {
  success: () => Promise<SuccessType>;
  notFound: () => Promise<NotFoundType>;
  invalidArgs: (error: string) => Promise<InvalidArgsType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
};

export class DeleteMerchantUseCase<
  SuccessType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> implements
    IDeleteMerchantUseCase<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >
{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IDeleteMerchantPresenter<
      SuccessType,
      NotFoundType,
      InvalidArgsType,
      FunctionalErrorType
    >,
  ) {}
  async execute(
    merchantId: number,
  ): Promise<
    SuccessType | NotFoundType | InvalidArgsType | FunctionalErrorType
  > {
    try {
      const merchant = await this.merchantRepository.findById(merchantId);
      if (!merchant) {
        return this.presenter.notFound();
      }
      await this.merchantRepository.delete(merchantId);
      return this.presenter.success();
    } catch (error) {
      return this.presenter.functionalError(error);
    }
  }
}
