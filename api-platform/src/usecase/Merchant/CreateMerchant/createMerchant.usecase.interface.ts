import { CurrencyEnum } from "../../../entity/Merchant";

export interface ICreateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> {
  execute(
    args: ICreateMerchantUseCaseArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | AlreadyExistsType
    | InvalidArgumentsType
    | NotFoundType
  >;
}

export type ICreateMerchantUseCaseArgs = {
  userId: number;
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  kbisUrl: string;
};
