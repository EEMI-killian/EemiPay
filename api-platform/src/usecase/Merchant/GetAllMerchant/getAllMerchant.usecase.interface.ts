

export interface IGetAllMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  InvalidArgumentsType,
> {
  execute(): Promise<
    SuccessType | FunctionalErrorType | InvalidArgumentsType
  >;
}