export interface IDeleteUserUseCase<
  SuccessType,
  FunctionalErrorType,
  NotFoundType,
  InvalidArgumentsType,
> {
  execute(
    args: deleteUserArgs,
  ): Promise<
    SuccessType | FunctionalErrorType | NotFoundType | InvalidArgumentsType
  >;
}

export type deleteUserArgs = {
  id: string;
};
