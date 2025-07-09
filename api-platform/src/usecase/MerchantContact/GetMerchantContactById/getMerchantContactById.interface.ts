export interface IAddMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: IGetMerchantContactUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

export type IGetMerchantContactUseCaseArgs = {
  merchantId: number;
  merchantContactId: number;
};
