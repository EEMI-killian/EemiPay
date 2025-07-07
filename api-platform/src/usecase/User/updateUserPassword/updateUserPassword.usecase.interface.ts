export interface IUpdateUserPasswordUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidPasswordType,
> {
  execute(
    args: updateUserPasswordArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidPasswordType
  >;
}

export type updateUserPasswordArgs = {
  id: string;
  inputOldPassword: string;
  newPassword: string;
};
