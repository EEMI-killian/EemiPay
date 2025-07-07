export interface IRotateCredentialUsecase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: RotateCredentialArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

type RotateCredentialArgs = {
  merchantId: string;
  appId: string;
};
