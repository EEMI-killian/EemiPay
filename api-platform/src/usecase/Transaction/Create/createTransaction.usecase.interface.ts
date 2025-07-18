import { CurrencyEnum } from "../../../entity/Merchant";

export interface ICreateTransactionUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
  NotFoundType,
> {
  execute({
    merchantId,
    customerId,
    amount,
    currency,
  }: {
    merchantId: string;
    customerId: string;
    amount: number;
    currency: CurrencyEnum;
  }): Promise<
    SuccessType | FunctionalErrorType | InvalidArgumentsType | NotFoundType
  >;
}
