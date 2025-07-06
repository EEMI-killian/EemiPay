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
  id: number;
  oldPassword: string;
  newPassword: string;
};
