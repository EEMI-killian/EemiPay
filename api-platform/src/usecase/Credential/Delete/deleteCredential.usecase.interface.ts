export interface IDeleteCredentialUsecase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: DeleteCredentialArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

type DeleteCredentialArgs = {
  merchantId: string;
  appId: string;
};
