import { I } from "@faker-js/faker/dist/airline-BUL6NtOJ";
import { IGetAllMerchantUseCase } from "./getAllMerchant.usecase.interface";
import { IMerchantRepository } from "../../../repository/Merchant/merchant.repository.interface";
import { Merchant } from "../../../entity/Merchant";



export type IGetAllMerchantUseCasePresenter<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
> = {
  success: (merchant : Merchant[]) => Promise<SuccessType>;
  functionalError: (error: string) => Promise<FunctionalErrorType>;
  invalidArguments: (error: string) => Promise<InvalidArgumentsType>;
};


export class GetAllMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
> implements IGetAllMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType
> {
    constructor(
    private readonly merchantRepository: IMerchantRepository,
    private readonly presenter: IGetAllMerchantUseCasePresenter<
      SuccessType,
      FunctionalErrorType,
      InvalidArgumentsType>
 ){}

    async execute(): Promise<
    SuccessType | FunctionalErrorType | InvalidArgumentsType
  > {
    try {
      const merchants = await this.merchantRepository.getAll();
      if (!merchants || merchants.length === 0) {
        return await this.presenter.success([]);
      }
      return await this.presenter.success(merchants);
    } catch (error) {
      return await this.presenter.functionalError(error);
    }
  }
}