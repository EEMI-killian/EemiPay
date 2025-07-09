import { CurrencyEnum } from "../../../entity/Merchant";



export interface ICreateMerchantUseCase<SuccessType, FunctionalErrorType , AlreadyExistsType ,InvalidArgumentsType> {
    execute(args: ICreateMerchantUseCaseArgs ): Promise<
    SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType
  >
}

export type ICreateMerchantUseCaseArgs = {
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  kbisUrl: string;
};