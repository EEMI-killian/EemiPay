export interface IGenerateCredentialUsecase<
  SuccesType,
  FunctionalErrorType,
  NotFound,
  InvalidArgumentsType,
> {
  execute(
    args: IGenerateCredentialArgs,
  ): Promise<
    SuccesType | FunctionalErrorType | NotFound | InvalidArgumentsType
  >;
}

type IGenerateCredentialArgs = {
  merchantId: string;
};
