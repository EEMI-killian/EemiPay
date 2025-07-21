export interface IRefundTransactionUseCase<
  SuccessType,
  NotFoundType,
  FunctionalErrorType,
> {
execute({ amountToRefund , transactionId }:{ amountToRefund: number; transactionId: string }) : Promise<SuccessType | NotFoundType | FunctionalErrorType>;
}