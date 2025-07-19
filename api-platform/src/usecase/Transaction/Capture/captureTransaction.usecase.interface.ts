import { cardInfo } from "../../../business/transaction.aggregate";
import { CurrencyEnum } from "../../../entity/Merchant";

export interface ICaptureTransactionUseCase<
  SuccessType,
  ProviderErrorType,
  NotFoundType,
  FunctionalErrorType,
> {
  execute({
    id,
    currency,
    customerCardInfo,
    amount,
  }: {
    id: string;
    currency: CurrencyEnum;
    customerCardInfo: cardInfo;
    amount: number;
  }): Promise<
    SuccessType | ProviderErrorType | NotFoundType | FunctionalErrorType
  >;
}
