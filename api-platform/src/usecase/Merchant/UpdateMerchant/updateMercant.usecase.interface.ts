import { CurrencyEnum } from "../../../entity/Merchant";

export interface IUpdateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> {
  execute(
    args: IUpdateMerchantUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgsType
  >;
}

type IUpdateMerchantUseCaseArgs = {
  id: string;
  redirectionUrlConfirm?: string;
  redirectionUrlCancel?: string;
  currency?: CurrencyEnum;
};
