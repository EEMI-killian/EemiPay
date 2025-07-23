export interface IFindTransactionUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
> {
  execute(
    transactionId: string,
  ): Promise<SuccessType | FunctionalErrorType | NotFoundType>;
}
