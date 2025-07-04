export interface IUpdateUserPasswordUseCase<
  SuccessType,
  FunctionnalErrorType,
  NotFoundType,
  InvalidPasswordType,
> {
  execute(
    args: updateUserPasswordArgs,
  ): Promise<
    SuccessType | FunctionnalErrorType | NotFoundType | InvalidPasswordType
  >;
}

export type updateUserPasswordArgs = {
  id: number;
  oldPassword: string;
  newPassword: string;
};
