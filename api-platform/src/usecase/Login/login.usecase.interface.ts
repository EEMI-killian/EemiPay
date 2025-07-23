export interface ILoginUsecase<
  SuccessType,
  PasswordErrorType,
  UserNotFoundErrorType,
  UserInactiveErrorType,
  FunctionalErrorType,
> {
  execute(
    email: string,
    password: string,
  ): Promise<
    | SuccessType
    | PasswordErrorType
    | UserNotFoundErrorType
    | UserInactiveErrorType
    | FunctionalErrorType
  >;
}
