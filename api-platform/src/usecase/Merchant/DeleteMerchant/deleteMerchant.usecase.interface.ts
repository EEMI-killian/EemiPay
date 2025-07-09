export interface IDeleteMerchantUseCase<
  SuccesType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> {
  execute(
    merchantId: number,
  ): Promise<SuccesType | NotFoundType | InvalidArgsType | FunctionalErrorType>;
}
