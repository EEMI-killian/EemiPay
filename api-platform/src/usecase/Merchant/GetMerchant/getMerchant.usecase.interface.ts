export interface IGetMerchantUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgsType,
> {
  execute(
    args: GetMerchantArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgsType
  >;
}

export type GetMerchantArgs = {
  id: string;
};
