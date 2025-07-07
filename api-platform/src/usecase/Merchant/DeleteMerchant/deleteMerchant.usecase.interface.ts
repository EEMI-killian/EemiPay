export interface IDeleteMerchantUseCase<
  SuccesType,
  NotFoundType,
  InvalidArgsType,
  FunctionalErrorType,
> {
  execute(
    args: DeleteMerchantArgs,
  ): Promise<SuccesType | NotFoundType | InvalidArgsType | FunctionalErrorType>;
}

export type DeleteMerchantArgs = {
  id: string;
};
