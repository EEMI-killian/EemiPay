import type { operation } from "../../../business/transaction.aggregate";
import { CurrencyEnum } from "../../../entity/Merchant";

export interface ICreateTransactionUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
  NotFoundType,
> {
  execute({
    id,
    merchantId,
    externalRef,
    amount,
    currency,
    operations,
    createdAt,
  }: {
    id: string;
    merchantId: string;
    externalRef: string;
    amount: number;
    operations: operation[];
    createdAt: Date;
    currency: CurrencyEnum;
  }): Promise<
    SuccessType | FunctionalErrorType | InvalidArgumentsType | NotFoundType
  >;
}
