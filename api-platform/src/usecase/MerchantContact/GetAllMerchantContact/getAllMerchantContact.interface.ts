export interface IGetAllMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: IGetAllMerchantContactUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

export type IGetAllMerchantContactUseCaseArgs = {
  merchantId: number;
};
