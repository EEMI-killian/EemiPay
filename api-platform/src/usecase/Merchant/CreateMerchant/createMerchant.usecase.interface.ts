import { CurrencyEnum } from "../../../entity/Merchant";

export interface ICreateMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
  NotFoundType,
> {
  execute(
    args: CreateMerchantUseCaseArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | AlreadyExistsType
    | InvalidArgumentsType
    | NotFoundType
  >;
}

export type CreateMerchantUseCaseArgs = {
  userId: string;
  companyName: string;
  redirectionUrlConfirm: string;
  redirectionUrlCancel: string;
  currency: CurrencyEnum;
  contactEmail: string;
  contactPhone: string;
  contactFirstName: string;
  contactLastName: string;
  kbisUrl: string;
};
