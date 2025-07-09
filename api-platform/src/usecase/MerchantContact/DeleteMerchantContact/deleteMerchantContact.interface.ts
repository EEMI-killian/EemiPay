export interface IDeleteMerchantContactUseCase<
  SuccessType,
  FunctionalErrorType,
  AlreadyExistsType,
  InvalidArgumentsType,
> {
  execute(
    args: IDeleteMerchantContactUseCaseArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | AlreadyExistsType | InvalidArgumentsType
  >;
}

export type IDeleteMerchantContactUseCaseArgs = {
  id: number;
};
