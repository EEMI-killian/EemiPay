export interface IGetMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> {
  execute(
    id: number,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgsType
  >;
}
