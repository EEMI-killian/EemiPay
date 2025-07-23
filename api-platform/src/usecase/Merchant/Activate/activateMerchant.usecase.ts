import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { IActivateMerchantUseCase } from "./activateMerchant.usecase.interface";

interface IActivateMerchantUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  success: () => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  notFound: () => Promise<NotFoundType>;
}


export class ActivateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> implements IActivateMerchantUseCase<SuccessType, FunctionalErrorType, NotFoundType>{
  constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IActivateMerchantUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      NotFoundType
    >,
  ) {}
  async execute({ id }: { id: string }): Promise<
    | SuccessType
    | FunctionalErrorType
    | NotFoundType
  > {
    const merchant = await this.merchantRepository.findById(id);
    if (!merchant) {
      return this.presenter.notFound();
    }

    try {
      await this.merchantRepository.activate(id)
      return this.presenter.success();
    }
    catch (error) {
      return this.presenter.functionalError(error.message);
    }
}
}