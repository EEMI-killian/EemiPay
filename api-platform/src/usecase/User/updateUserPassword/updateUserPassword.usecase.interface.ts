export interface IUpdateUserPasswordUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
  InvalidArgumentsType,
> {
  execute(
    args: updateUserPasswordArgs,
  ): Promise<
    | SuccessType
    | FunctionalErrorType
    | NotFoundType
    | InvalidPasswordType
    | InvalidArgumentsType
  >;
}

export type updateUserPasswordArgs = {
  id: string;
  inputOldPassword: string;
  newPassword: string;
};
